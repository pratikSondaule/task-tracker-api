import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CreateUserDto } from 'src/validations/user/createUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SigninUserDto } from 'src/validations/user/signinUser.dto';
import { InviteStatus } from '@prisma/client';

@Injectable()
export class UserService {

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    async createUser(data: CreateUserDto) {

        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: data?.email
            }
        })

        if (existingUser) {
            throw new HttpException('User with this email is already registered', HttpStatus.CONFLICT)
        }

        if (data?.password && data?.password.trim().length <= 7) {
            throw new HttpException('Password should be atleast 8 character long', HttpStatus.BAD_REQUEST)
        }

        try {

            const salt = await bcrypt.genSalt(10)

            const hashedPassword = await bcrypt.hash(data?.password.trim(), salt)

            const userData = {
                first_name: data?.first_name.trim(),
                last_name: data?.last_name.trim(),
                email: data?.email.trim(),
                password: hashedPassword
            }

            const createUser = await this.prisma.user.create({
                data: userData
            })

            return {
                statusCode: HttpStatus.CREATED,
                message: "Signup successfully",
                user: createUser
            }

        } catch (error) {
            console.log(error)
            throw new HttpException('Something went wrong in signup', HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }


    async signin(data: SigninUserDto) {

        const user = await this.prisma.user.findUnique({
            where: {
                email: data?.email
            }
        })

        if (!user) {
            throw new HttpException('User with this email not found', HttpStatus.NOT_FOUND)
        }

        const isMatch = await bcrypt.compare(data?.password.trim(), user.password)

        if (!isMatch) {
            throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED)
        }

        try {

            const payload = {
                id: user.id,
                email: user.email
            }

            let jwtToken = await this.jwtService.signAsync(payload, {
                privateKey: process.env.JWT_SECRET,
            })

            return {
                statusCode: HttpStatus.OK,
                token: jwtToken,
                message: "Signin successfully"
            }

        } catch (error) {
            console.log(error)
            throw new HttpException('Something went wrong in signin', HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }


    async getInvites(request: any, page: number, limit: number) {

        console.log("User ", request.user)

        const { id: loggedInUserId } = request.user

        const user = await this.prisma.user.findUnique({
            where: {
                id: loggedInUserId
            }
        })

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }

        let pageNumber = page || 1
        let limitNumber = limit || 10

        try {
            const getInvites = await this.prisma.invite_collaborator.findMany({
                where: {
                    email: user.email,
                    invite_status: InviteStatus.PENDING
                },
                select: {
                    id: true,
                    email: true,
                    invite_status: true,
                    invited_by: {
                        select: {
                            first_name: true,
                            last_name: true,
                            email: true
                        }
                    },
                    task: {
                        select: {
                            title: true,
                            description: true,
                            status: true
                        }
                    }
                },
                take: limitNumber,
                skip: (pageNumber - 1) * limitNumber,
            })

            const totalInviteCount = await this.prisma.invite_collaborator.count({
                where: {
                    email: user.email,
                    invite_status: InviteStatus.PENDING
                }
            })

            const totalPages = Math.ceil(totalInviteCount / limitNumber)

            return {
                status: HttpStatus.OK,
                invites: getInvites,
                currentPage: pageNumber,
                hasNextPage: pageNumber < totalPages ? pageNumber + 1 : null,
                hasPreviousPage: pageNumber > 1,
                lastPage: totalPages,
                totalInvites: totalInviteCount,
                message: "Fetched all invites successfully"
            }

        } catch (error) {
            console.log(error)
            throw new HttpException('Something went wrong fetching invites', HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }


    async acceptInvites(request: any, invite_id: string) {

        console.log("User ", request.user)

        const { id: loggedInUserId } = request.user

        const user = await this.prisma.user.findUnique({
            where: {
                id: loggedInUserId
            }
        })

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }

        const getInvite = await this.prisma.invite_collaborator.findFirst({
            where: {
                id: invite_id,
                invite_status: InviteStatus.PENDING
            }
        })

        if (!getInvite) {
            throw new HttpException('Invitation already accepted or does not exist', HttpStatus.NOT_FOUND)
        }

        try {

            await this.prisma.invite_collaborator.update({
                where: {
                    id: getInvite.id
                },
                data: {
                    invite_status: InviteStatus.ACCEPTED
                }
            })

            return {
                statusCode: HttpStatus.OK,
                message: "Collaboration invite accepted successfully"
            }

        } catch (error) {
            console.log(error)
            throw new HttpException('Something went wrong accepting invites', HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

}
