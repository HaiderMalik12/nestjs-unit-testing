import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  //real db call
  findById(id: number) {
    return null;
  }
  create(data: { id: number; name: string; email: string }) {
    return null;
  }
  findAll() {
    return [];
  }
  delete(id: number) {
    return true;
  }
  findByEmail(email: string) {
    return null;
  }
}
@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}
  private users: {
    id: number;
    name: string;
    email: string;
  }[] = [];

  async createUser(name: string, email: string) {
    const existingUser = await this.repo.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already created with this email');
    }
    const user = {
      id: this.users.length + 1,
      name,
      email,
    };
    // this.users.push(user);
    return this.repo.create(user);
  }
  async findById(id: number) {
    // return this.users.find((user) => user.id === id);
    return this.repo.findById(id);
  }
  async findAll() {
    return this.repo.findAll();
  }
  deleteUser(id: number) {
    return this.repo.delete(id);
  }
}
