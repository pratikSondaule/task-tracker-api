import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from 'src/validations/task/createTask.dto';
import { UpdateTaskDto } from 'src/validations/task/updateTask.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('task')
export class TaskController {

    constructor(
        private taskService: TaskService
    ) { }

    @ApiOperation({ summary: "Create task" })
    @UseGuards(AuthGuard)
    @Post('create')
    async createTask(
        @Req() request: Request,
        @Body() data: CreateTaskDto
    ) {
        return await this.taskService.createTask(request, data)
    }


    @ApiOperation({ summary: "Fetch all tasks of logged-in user" })
    @UseGuards(AuthGuard)
    @Get('get-all')
    async getUserTasks(@Req() request: Request) {
        return await this.taskService.getUserTasks(request)
    }


    @ApiOperation({ summary: "Update task" })
    @UseGuards(AuthGuard)
    @ApiParam({
        name: 'task_id',
        type: String
    })
    @Put('update/:task_id')
    async updateUserTask(
        @Req() request: Request,
        @Param('task_id') task_id: string,
        @Body() data: UpdateTaskDto
    ) {
        return await this.taskService.updateUserTask(request, task_id, data)
    }


    @ApiOperation({ summary: "Delete task" })
    @UseGuards(AuthGuard)
    @ApiParam({
        name: 'task_id',
        type: String
    })
    @Delete('delete/:task_id')
    async deleteTask(
        @Req() request: Request,
        @Param('task_id') task_id: string,
    ) {
        return await this.taskService.deleteTask(request, task_id)
    }

}
