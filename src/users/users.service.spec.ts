import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
   
  it('should create a new user', () => {

    const service = new UsersService();

    const user = service.createUser('John', 'john@example.com');
    expect(user.name).toBe('John');
    expect(user.email).toBe('john@example.com')
    expect(user.id).toBe(1)
  })


  it('should create two users with diff ids', () => {

    const service = new UsersService();

    const user = service.createUser('John', 'john@example.com');
    const user2 = service.createUser("Jane", "jane@example.com");

    expect(user.name).toBe('John');
    expect(user.email).toBe('john@example.com')
    expect(user.id).toBe(1)

    expect(user2.id).toBe(2)
  })
  
});
