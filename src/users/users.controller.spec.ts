import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersRepository, UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  const mockUsersService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        UsersRepository,
      ],
    }).compile();
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a user by id', async () => {
    mockUsersService.findById.mockResolvedValue({
      id: '1',
      name: 'John',
      email: 'john@example.com',
    });
    const result = await controller.findById('1');
    expect(result).toEqual({
      id: '1',
      name: 'John',
      email: 'john@example.com',
    });

    expect(mockUsersService.findById).toHaveBeenCalledWith(1);
  });

  it('should return undefined when user is not found', async () => {
    mockUsersService.findById.mockResolvedValue(undefined);

    const result = await controller.findById('8888');
    expect(result).toBeUndefined();
  });
});
