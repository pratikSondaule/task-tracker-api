import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/validations/user/createUser.dto';
import { SigninUserDto } from 'src/validations/user/signinUser.dto';
import { ApiOperation, ApiTags } from "@nestjs/swagger";

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

}
