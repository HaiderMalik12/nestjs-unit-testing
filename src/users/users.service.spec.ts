import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  beforeEach(() => {
    service = new UsersService();
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
    it('should the user by id', () => {
      const user = service.createUser('John', 'john@example.com');

      expect(service.findById(1)).toEqual({
        id: 1,
        name: 'John',
        email: 'john@example.com',
      });
    });
    it('should return undefined when user does not exist', () => {
      const user = service.createUser('John', 'john@example.com');

      expect(service.findById(999)).toBeUndefined();
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
    it('should delete the user', () => {
      service.createUser('John', 'john@example.com');
      service.createUser('John2', 'john2@example.com');

      const deleteResult = service.deleteUser(1);

      expect(deleteResult).toBe(true);
      expect(service.findById(1)).toBeUndefined();
    });

    it('should return false when user does not exist for delete', () => {
      service.createUser('John', 'john@example.com');

      const deleteResult = service.deleteUser(999);

      expect(deleteResult).toBe(false);
    });
  });
});
