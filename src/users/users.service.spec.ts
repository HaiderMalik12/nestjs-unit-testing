import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository, UsersService } from './users.service';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: {
    findById: jest.Mock;
    create: jest.Mock;
    findAll: jest.Mock;
    delete: jest.Mock;
    findByEmail: jest.Mock;
  };

  beforeEach(async () => {
    mockRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      findByEmail: jest.fn(),
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
      mockRepository.findByEmail.mockResolvedValue(undefined);

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
      mockRepository.findByEmail.mockResolvedValue(undefined);
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

    it('should throw if email already exist', async () => {
      mockRepository.findByEmail.mockResolvedValue({
        id: 1,
        name: 'John',
        email: 'john@example.com',
      });

      await expect(
        service.createUser('John', 'john@example.com'),
      ).rejects.toThrow(ConflictException);
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

  describe('findAll users', () => {
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
      expect(mockRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete the user', async () => {
      mockRepository.delete.mockResolvedValue(true);

      const deleteResult = await service.deleteUser(1);

      expect(deleteResult).toBe(true);
    });

    it('should delete false if user does not exist', async () => {
      mockRepository.delete.mockResolvedValue(false);

      const deleteResult = await service.deleteUser(999);

      expect(deleteResult).toBe(false);
    });
  });
});
