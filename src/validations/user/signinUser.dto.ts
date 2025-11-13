import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SigninUserDto {

    @ApiProperty({ example: 'hitogallemmei-3704@yopmail.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'testpass@123' })
    @IsString()
    @IsNotEmpty()
    password: string;

}