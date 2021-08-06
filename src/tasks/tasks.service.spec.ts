import { TasksService } from './tasks.service';
import { Test } from '@nestjs/testing';
import { TasksRepository } from './tasks.repository';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

//mock providing a factory function
const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  id: '1',
  username: 'Leandro',
  password: 'SomePassword',
  tasks: [],
};

const mockTask = {
  title: 'Task Title',
  description: 'Some description',
  id: 'someId',
  status: TaskStatus.OPEN,
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    // initialize a NestJS module with tasksService and tasksRepository
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('get tasks from user without tasks created', async () => {
      //mock the response of the repository
      tasksRepository.getTasks.mockResolvedValue([]); //with promises we use mockResolvedValue
      const result = await tasksService.getTasks(null, mockUser);

      expect(result).toEqual([]);
    });
  });

  describe('getTaskById', () => {
    it('get task by id return simple task', async () => {
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('someId', mockUser);

      expect(result).toEqual(mockTask);
    });

    it('get non-existent task return error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);

      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
