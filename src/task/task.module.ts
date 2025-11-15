import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { PrismaService } from 'src/services/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SendMailService } from 'src/services/sendMail.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService, JwtService, SendMailService]
})
export class TaskModule { }
