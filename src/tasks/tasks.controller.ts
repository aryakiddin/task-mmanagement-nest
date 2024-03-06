import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { filter } from 'rxjs';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger(`TasksController`);

    constructor (
         private tasksService: TasksService,
         private configService : ConfigService           
        ) {
            console.log(configService.get('TEST_VALUE'))
        }

    @Get()
    getTasks(
        @Query() filterDto: GetTaskFilterDTO,
        @GetUser() user: User,
    ): Promise<Task[]> {
        //if we have any filters defined call taskservice.getTaskWithFilters else call tasksService.getAllTasks()
        // if(Object.keys(filterDto).length){
        //     return this.tasksService.getTasksWithFilters(filterDto);
        // }else {
        this.logger.verbose(`User "${user.username}" retrieving all tasks. Filter: ${JSON.stringify(filterDto)}`)
        console.log("here")
        return this.tasksService.getTasks(filterDto, user);
        //   }
    }

    @Get('/:id')
   async getTaskById(@Param('id') id: string, @GetUser() user: User): Promise <Task>{
        console.log("heree")
        return this.tasksService.getTaskById(id, user)
    }
   
    @Delete('/:id')
   async deleteTaskbyId(@Param('id') id: string, @GetUser() user: User): Promise<void>{
        console.log(id)
        this.logger.verbose(`User ${user.username} deleting task with taskID: ${id}`)
        this.tasksService.deleteTaskById(id, user)
    }

    @Patch('/:id/status')
    updateTaskById(
        @Param('id') id: string,
        @GetUser() user: User,
        @Body() updateTaskStatusDto: UpdateTaskStatusDTO): Promise<Task> {
            const {status} = updateTaskStatusDto;
        return this.tasksService.updateTaskById(id, status, user)
    }

    @Post()
    createTask(
        @Body() createTaskDto: CreateTaskDTO,
        @GetUser() user: User ): Promise <Task> {
        return this.tasksService.createTask(createTaskDto, user)
    }
}
