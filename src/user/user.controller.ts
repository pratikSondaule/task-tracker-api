import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/validations/user/createUser.dto';
import { SigninUserDto } from 'src/validations/user/signinUser.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from 'src/guards/auth/auth.guard';

@ApiTags('Users')
@Controller('user')
export class UserController {

    constructor(
        private userService: UserService
    ) { }

    @ApiOperation({ summary: "User signup" })
    @Post('signup')
    async createUser(@Body() data: CreateUserDto) {
        return await this.userService.createUser(data)
    }


    @ApiOperation({ summary: "User login" })
    @Post('signin')
    async signin(@Body() data: SigninUserDto) {
        return await this.userService.signin(data)
    }


    @ApiOperation({ summary: "Fetch all invites" })
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of records to fetch per page' })
    @Get('get-invites')
    async getUserTasks(
        @Req() request: Request,
        @Query('page', new ParseIntPipe({ optional: true })) page: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
    ) {
        return await this.userService.getInvites(request, page, limit)
    }


    @ApiOperation({ summary: "Accept collaboration invitation" })
    @UseGuards(AuthGuard)
    @ApiParam({
        name: 'invite_id',
        type: String
    })
    @ApiBearerAuth()
    @Post('accept-invite/:invite_id')
    async acceptInvites(
        @Req() request: Request,
        @Param('invite_id') invite_id: string,
    ) {
        return await this.userService.acceptInvites(request, invite_id)
    }

}
