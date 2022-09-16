import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  async find(id: string, user: User): Promise<Task> {
    return await this.tasksRepository.findOneByOrFail({ id, user });
  }

  async destroy(id: string, user: User): Promise<void> {
    const { affected } = await this.tasksRepository.delete({ id, user });

    if (affected === 0) {
      throw new NotFoundException(`Task with id=${id} not found`);
    }
  }

  async filter(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    return await this.tasksRepository.getTasks(filterDto, user);
  }

  async update(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.find(id, user);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

  create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }
}
