import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTaskDto {

    @ApiProperty({ example: "My Task" })
    @IsString()
    @IsNotEmpty()
    title: string

    @ApiProperty({ example: "Task description" })
    @IsString()
    @IsNotEmpty()
    description: string

}