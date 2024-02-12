import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository,  } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
 
@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {
    super(
        tasksRepository.target,
        tasksRepository.manager,
        tasksRepository.queryRunner,
      );
  }
 
  async getTasks(filterDto: GetTaskFilterDTO, user:User): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const sqlQuery = query.getSql();
    console.log('Generated SQL query:', sqlQuery);
    
      const tasks = await query.getMany();
      return tasks;
  }


  async createTask({ title, description }: CreateTaskDTO, user:User): Promise<Task> {
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    });
 
    await this.save(task);
    return task;
  }
}