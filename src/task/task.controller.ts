import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from 'src/validations/task/createTask.dto';
import { UpdateTaskDto } from 'src/validations/task/updateTask.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { InviteCollaboratorDto } from 'src/validations/task/inviteCollaborator.dto';

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
    @ApiQuery({ name: 'status', required: false, description: 'Filter with any one status [ pending, in-progress, completed ]' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of records to fetch per page' })
    @Get('get-all')
    async getUserTasks(
        @Req() request: Request,
        @Query('status') status: string,
        @Query('page', new ParseIntPipe({ optional: true })) page: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
    ) {
        return await this.taskService.getUserTasks(request, status, page, limit)
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


    @ApiOperation({ summary: "Invite someone to collaborate on your task using their email" })
    @UseGuards(AuthGuard)
    @ApiParam({
        name: 'task_id',
        type: String
    })
    @Post('invite-collaborator/:task_id')
    async inviteCollaborator(
        @Req() request: Request,
        @Param('task_id') task_id: string,
        @Body() data: InviteCollaboratorDto
    ) {
        return await this.taskService.inviteCollaborator(request, task_id, data)
    }

}
