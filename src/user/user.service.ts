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

            await this.prisma.invite_collaborator.updateMany({
                where: {
                    email: data?.email
                },
                data: {
                    invite_status: InviteStatus.ACCEPTED
                }
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

}
