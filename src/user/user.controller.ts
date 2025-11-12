import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/validations/user/createUser.dto';
import { SigninUserDto } from 'src/validations/user/signinUser.dto';
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Users')
@Controller('user')
export class UserController {

    constructor(
        private userService: UserService
    ) { }

    @Post('signup')
    async createUser(@Body() data: CreateUserDto) {
        return await this.userService.createUser(data)
    }


    @Post('signin')
    async signin(@Body() data: SigninUserDto) {
        return await this.userService.signin(data)
    }

}
