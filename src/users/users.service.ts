import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  //real db call
  findById(id: number){
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

  createUser(name: string, email: string) {
    const user = {
      id: this.users.length + 1,
      name,
      email,
    };
    this.users.push(user);
    return user;
  }
  async findById(id: number) {
    // return this.users.find((user) => user.id === id);
    return this.repo.findById(id);
  }
  findAll() {
    return this.users;
  }
  deleteUser(id: number) {
    const index = this.users.findIndex((user) => user.id === id);

    if (index === -1) {
      return false;
    }

    this.users.splice(index, 1);

    return true;
  }
}
