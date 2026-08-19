import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository, UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: {
    findById: jest.Mock;
    create: jest.Mock;
    findAll: jest.Mock;
  };

  beforeEach(async () => {
    mockRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
    };
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      mockRepository.create.mockResolvedValue({
        id: 1,
        name: 'John',
        email: 'john@example.com',
      });
      const user = await service.createUser('John', 'john@example.com');
      expect(user).toEqual({
        id: 1,
        name: 'John',
        email: 'john@example.com',
      });
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });
    it('should create two users with diff ids', async () => {
      // pretend that repo created user successfully in the db
      mockRepository.create
        .mockResolvedValueOnce({
          id: 1,
          name: 'John',
          email: 'john@example.com',
        })
        .mockResolvedValueOnce({
          id: 2,
          name: 'Jane',
          email: 'jane@example.com',
        });

      const user = await service.createUser('John', 'john@example.com');
      const user2 = await service.createUser('Jane', 'jane@example.com');

      expect(user2).toEqual({
        id: 2,
        name: 'Jane',
        email: 'jane@example.com',
      });
      expect(mockRepository.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('findById', () => {
    it('should the user by id', async () => {
      mockRepository.findById.mockResolvedValue({
        id: 2,
        name: 'John',
        email: 'john@example.com',
      });

      expect(await service.findById(2)).toEqual({
        id: 2,
        name: 'John',
        email: 'john@example.com',
      });

      expect(mockRepository.findById).toHaveBeenCalledWith(2);
    });
    it('should return undefined when user does not exist', async () => {
      mockRepository.findById.mockResolvedValue(undefined);
      const user = service.createUser('John', 'john@example.com');

      expect(await service.findById(999)).toBeUndefined();
      expect(mockRepository.findById).toHaveBeenCalledWith(999);
    });

    it('should throw when repository fails', async () => {
      mockRepository.findById.mockRejectedValue(new Error('Database Error'));

      await expect(service.findById(1)).rejects.toThrow('Database Error');
    });
  });

  describe.only('findAll users', () => {
    it('should find all users', async () => {
      mockRepository.findAll.mockResolvedValue([
        {
          id: 1,
          name: 'John',
          email: 'john@example.com',
        },
        {
          id: 2,
          name: 'Jane',
          email: 'jane@example.com',
        },
      ]);

      const users = await service.findAll();

      expect(users).toHaveLength(2);
      expect(mockRepository.findAll).toHaveBeenCalled()
    });
  });

  describe('deleteUser', () => {
    it('should delete the user', async () => {
      service.createUser('John', 'john@example.com');
      service.createUser('John2', 'john2@example.com');

      const deleteResult = service.deleteUser(1);

      expect(deleteResult).toBe(true);
      expect(await service.findById(1)).toBeUndefined();
    });

    it('should return false when user does not exist for delete', async () => {
      mockRepository.create.mockResolvedValue({
        id: 2,
        name: 'Jane',
        email: 'jane@example.com',
      });
      await service.createUser('John', 'john@example.com');

      const deleteResult = service.deleteUser(999);

      expect(deleteResult).toBe(false);
    });
  });
});
