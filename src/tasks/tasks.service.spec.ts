import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  const mockTasksRepository = () => ({
    getTasks: jest.fn(),
    findOneByOrFail: jest.fn(),
  });

  const mockUser = {
    id: 234,
    username: 'Pedro',
    password: 'somePassword',
    tasks: [],
  };

  const mockTask = {
    id: '123',
    title: 'Test task',
    description: 'Test description',
    status: TaskStatus.OPEN,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get<TasksRepository>(TasksRepository);
  });

  describe('filter', () => {
    it('calls TasksRepository.getTasks(filter) and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.filter(null, mockUser);

      expect(result).toEqual('someValue');
    });
  });

  describe('find', () => {
    it('calls TasksRepository.findOneByOrFail() and returns the result', async () => {
      tasksRepository.findOneByOrFail.mockResolvedValue(mockTask);

      const result = await tasksService.find('123', mockUser);

      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findOneByOrFail() and hadles an error', async () => {
      tasksRepository.findOneByOrFail.mockResolvedValue(null);
      expect(tasksService.find('123', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
