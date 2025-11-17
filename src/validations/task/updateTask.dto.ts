import { ApiProperty } from "@nestjs/swagger";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateTaskDto {

    @ApiProperty({ example: "Updated Task" })
    @IsString()
    @IsOptional()
    title: string

    @ApiProperty({ example: "Task description" })
    @IsString()
    @IsOptional()
    description: string

    @ApiProperty({ example: "LOW | MEDIUM | HIGH " })
    @IsEnum(TaskPriority)
    @IsOptional()
    priority: TaskPriority

    @ApiProperty({ example: "PENDING | IN_PROGRESS | COMPLETED" })
    @IsEnum(TaskStatus)
    @IsOptional()
    status: TaskStatus

}