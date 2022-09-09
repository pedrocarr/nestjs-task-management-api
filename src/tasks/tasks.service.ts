import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  async find(id: string): Promise<Task> {
    return await this.tasksRepository.findOneByOrFail({ id });
  }

  async destroy(id: string): Promise<void> {
    const { affected } = await this.tasksRepository.delete(id);

    if (affected === 0) {
      throw new NotFoundException(`Task with id=${id} not found`);
    }
  }

  async filter(filterDto: GetTaskFilterDto): Promise<Task[]> {
    return await this.tasksRepository.getTasks(filterDto);
  }

  async update(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.find(id);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

  create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }
}
