import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';
import { CreateTaskDto } from 'src/validations/task/createTask.dto';
import { UpdateTaskDto } from 'src/validations/task/updateTask.dto';

@Injectable()
export class TaskService {

    constructor(
        private prisma: PrismaService
    ) { }

    async createTask(request: any, data: CreateTaskDto) {

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

        try {

            const taskData = {
                title: data?.title,
                description: data?.description,
                created_by_id: user.id
            }

            const createTask = await this.prisma.task.create({
                data: taskData
            })

            return {
                statusCode: HttpStatus.CREATED,
                message: "Task created successfully",
                task: createTask
            }

        } catch (error) {
            console.log(error)
            throw new HttpException('Something went wrong while creating task', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async getUserTasks(request: any, status: string, page: number, limit: number) {

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

        let statusFilter: TaskStatus | undefined

        if (status && status == 'pending') {
            statusFilter = TaskStatus.PENDING
        } else if (status && status == 'in-progress') {
            statusFilter = TaskStatus.IN_PROGRESS
        } else if (status && status == 'completed') {
            statusFilter = TaskStatus.COMPLETED
        }

        let pageNumber = page ? page : 1
        let limitNumber = limit ? limit : 10

        try {

            const getUserTask = await this.prisma.task.findMany({
                where: {
                    created_by_id: user?.id,
                    status: statusFilter
                },
                take: limitNumber,
                skip: (pageNumber - 1) * limitNumber,
            })

            const totalTaskCount = getUserTask.length

            const totalPages = Math.ceil(totalTaskCount / limitNumber)

            return {
                statusCode: HttpStatus.OK,
                tasks: getUserTask,
                currentPage: pageNumber,
                hasNextPage: pageNumber < totalPages ? pageNumber + 1 : null,
                hasPreviousPage: pageNumber > 1,
                lastPage: totalPages,
                totalTasks: totalTaskCount,
                message: "Fetched all tasks successfully"
            }

        } catch (error) {
            console.log(error)
            throw new HttpException('Something went wrong while fetching tasks', HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }


    async updateUserTask(request: any, task_id: string, data: UpdateTaskDto) {

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

        const getTaskById = await this.prisma.task.findUnique({
            where: {
                id: task_id
            }
        })

        if (!getTaskById) {
            throw new HttpException('Task not found', HttpStatus.NOT_FOUND)
        }

        if (getTaskById.created_by_id !== user.id) {
            throw new HttpException("This user can't update this task", HttpStatus.BAD_REQUEST)
        }

        try {

            const updateUserTaskData = {
                title: data?.title,
                description: data?.description,
                status: data?.status
            }

            const updateTask = await this.prisma.task.update({
                where: {
                    id: getTaskById.id
                },
                data: updateUserTaskData
            })

            return {
                statusCode: HttpStatus.OK,
                message: "Updated tasks successfully",
                task: updateTask
            }

        } catch (error) {
            console.log(error)
            throw new HttpException('Something went wrong while updating task', HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }


    async deleteTask(request: any, task_id: string) {

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

        const getTaskById = await this.prisma.task.findUnique({
            where: {
                id: task_id
            }
        })

        if (!getTaskById) {
            throw new HttpException('Task not found', HttpStatus.NOT_FOUND)
        }

        if (getTaskById.created_by_id !== user.id) {
            throw new HttpException("This user can't delete this task", HttpStatus.BAD_REQUEST)
        }

        try {
            await this.prisma.task.delete({
                where: {
                    id: getTaskById.id
                }
            })

            return {
                statusCode: HttpStatus.OK,
                message: "Task deleted successfully",
            }

        } catch (error) {
            console.log(error)
            throw new HttpException('Something went wrong while deleting task', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
