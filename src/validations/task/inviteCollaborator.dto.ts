import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class InviteCollaboratorDto {

    @ApiProperty({ example: "hitogallemmei-3704@yopmail.com" })
    @IsEmail()
    @IsNotEmpty()
    email: string;

}