import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import {TypeOrmDataSourceFactory } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {TypeOrmModule} from '@nestjs/typeorm'
import { TasksRepository } from './task.repository';
import { AuthModule } from 'src/auth/auth.module';
//import { TasksRepository } from 'src/tasks/tasks.repository';

@Module({
  imports : [TypeOrmModule.forFeature([Task]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
 // exports: []
})
export class TasksModule {}
