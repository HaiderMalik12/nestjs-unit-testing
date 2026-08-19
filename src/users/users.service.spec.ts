import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository, UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: {
    findById: jest.Mock;
  };

  beforeEach(async () => {
    mockRepository = {
      findById: jest.fn(),
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
    it('should create a new user', () => {
      const user = service.createUser('John', 'john@example.com');
      expect(user.name).toBe('John');
      expect(user.email).toBe('john@example.com');
      expect(user.id).toBe(1);
    });
    it('should create two users with diff ids', () => {
      const user = service.createUser('John', 'john@example.com');
      const user2 = service.createUser('Jane', 'jane@example.com');

      expect(user.name).toBe('John');
      expect(user.email).toBe('john@example.com');
      expect(user.id).toBe(1);

      expect(user2.id).toBe(2);
    });
  });

  describe('findById', () => {
    it('should the user by id', async() => {
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

      expect(mockRepository.findById).toHaveBeenCalledWith(2)
    });
    it('should return undefined when user does not exist', async() => {
      mockRepository.findById.mockResolvedValue(undefined);
      const user = service.createUser('John', 'john@example.com');

      expect(await service.findById(999)).toBeUndefined();
      expect(mockRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('findAll users', () => {
    it('should find all users', () => {
      service.createUser('John', 'john@example.com');
      service.createUser('John2', 'john2@example.com');

      const users = service.findAll();

      expect(users).toHaveLength(2);
    });
  });

  describe('deleteUser', () => {
    it('should delete the user', async() => {
      service.createUser('John', 'john@example.com');
      service.createUser('John2', 'john2@example.com');

      const deleteResult = service.deleteUser(1);

      expect(deleteResult).toBe(true);
      expect(await service.findById(1)).toBeUndefined();
    });

    it('should return false when user does not exist for delete', () => {
      service.createUser('John', 'john@example.com');

      const deleteResult = service.deleteUser(999);

      expect(deleteResult).toBe(false);
    });
  });
});
