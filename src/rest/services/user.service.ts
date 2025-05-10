import { inject, injectable } from 'inversify';
import { Component } from '../component.js';
import { UserRepository } from '../../db/repos/index.js';
import { CreateUserDto, GetUserDto } from '../dto/index.js';

@injectable()
export class UserService {
  constructor(
    @inject(Component.UserRepository) private readonly userRepository: UserRepository,
  ) { }

  public async create(dto: CreateUserDto): Promise<GetUserDto> {
    const user = await this.userRepository.create(dto);
    return { ...user, id: user.id };
  }

  public async findById(id: string): Promise<GetUserDto | null> {
    const user = await this.userRepository.findById(id);
    if (user === null) {
      return null;
    }
    return { ...user, id: user.id.toString() };
  }

  public async uploadProfilePicture(userId: string, profilePicturePath: string): Promise<GetUserDto | null> {
    const user = await this.userRepository.edit(userId, { profilePicture:  profilePicturePath});
    if (user === null) {
      return null;
    }
    return { ...user, id: user.id.toString() };
  }
}
