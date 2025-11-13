import { ApiProperty } from "@nestjs/swagger";
import { TaskStatus } from "@prisma/client";
import { IsOptional, IsString } from "class-validator";

export class UpdateTaskDto {

    @ApiProperty({ example: "Updated Task" })
    @IsString()
    @IsOptional()
    title: string

    @ApiProperty({ example: "Task description" })
    @IsString()
    @IsOptional()
    description: string

    @ApiProperty({ example: "PENDING | IN_PROGRESS | COMPLETED" })
    @IsString()
    @IsOptional()
    status: TaskStatus

}