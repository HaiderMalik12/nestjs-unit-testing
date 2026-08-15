import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users : {
   id: number;
   name: string;
   email: string;
  }[] = [];

  createUser(name: string, email: string) {
    const user = {
      id: this.users.length +1,
      name,
      email
    }
    this.users.push(user);
    return user;
  }
  findById(id: number) {}
  findAll() {}
  deleteUser(id: number) {}
}
