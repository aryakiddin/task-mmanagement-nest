import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { filter } from 'rxjs';
//import { TasksRepository } from 'src/tasks/TasksRepository';
import { TasksRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Injectable()
export class TasksService {
   
    constructor (
        @InjectRepository(TasksRepository)
        private taskRepository: TasksRepository,
    ){}

    getTasks(filterDto: GetTaskFilterDTO, user:User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
      }

    // getTasksWithFilters(filterDto: GetTaskFilterDTO) : Task [] {
    //     const {status, search} = filterDto;
    //     let tasks = this.getAllTasks();

    //     if(status){
        
    //         tasks = tasks.filter(task=> task.status === status )
    //         return tasks;
    //     }
    //     if(search){
    //         tasks = tasks.filter((task) => {
    //             if(task.title.includes(search) || task.description.includes(search)){
    //                 return true;
    //             }
    //             return false;
    //         })
    //         return tasks;
    //     }
    // } 

    async getTaskById(id:string, user:User): Promise<Task>{

        console.log(id)
        const found = await this.taskRepository.findOne({where: {id:id, user}});
        console.log(found)

        if(!found){
            console.log("heree")
            throw new NotFoundException(`Task with ID ${id} not found!`)
        }
        
        
        return found;
    }


   async deleteTaskById(id: string, user:User): Promise<void> {
    //   const index = this.tasks.findIndex((task) => task.id === id);
    //   if(index !== -1){
    //    this.tasks.splice(index, 1)
    //   }
    //   if(index === -1){
    //     throw new NotFoundException(`Task with ${id} not found!`);
    //   }
      const task = await this.getTaskById(id, user);
      console.log(task)
      if(!task){
        throw new NotFoundException(`Task not found with id ${id}`)
      }
      const result = await this.taskRepository.delete({id, user})
      console.log(result)

      if(result.affected === 0){
        throw new NotFoundException(`Task with Id${id} not found!`)
      }
    }

    async updateTaskById(id: string, status: TaskStatus, user: User): Promise<Task> {
        console.log(id)
        const task = await this.getTaskById(id, user);
        if(!task){
          throw new NotFoundException()
        }
        task.status = status ;
        await this.taskRepository.save(task)
        return task;
        
    }


     createTask(createTaskDto: CreateTaskDTO, user:User) : Promise<Task> {
        const {title, description} = createTaskDto;
        return   this.taskRepository.createTask(createTaskDto, user)
        
     //   return this.taskRepository.save(task);
      //  return task;
    }
}
