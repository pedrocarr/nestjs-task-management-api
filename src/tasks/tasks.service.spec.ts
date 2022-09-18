import { Test } from '@nestjs/testing';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  const mockTasksRepository = () => ({
    getTasks: jest.fn(),
  });

  const mockUser = {
    id: 234,
    username: 'Pedro',
    password: 'somePassword',
    tasks: [],
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

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks(filter) and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.filter(null, mockUser);

      expect(result).toEqual('someValue');
    });
  });
});
