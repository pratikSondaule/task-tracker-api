import { ApiProperty } from "@nestjs/swagger";
import { TaskPriority } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {

    @ApiProperty({ example: "My Task" })
    @IsString()
    @IsNotEmpty()
    title: string

    @ApiProperty({ example: "Task description" })
    @IsString()
    @IsNotEmpty()
    description: string

    @ApiProperty({ example: "LOW | MEDIUM | HIGH " })
    @IsEnum(TaskPriority)
    @IsOptional()
    priority: TaskPriority
}