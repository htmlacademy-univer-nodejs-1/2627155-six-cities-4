import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';
import { Component } from '../component.js';
import { UserRepository } from '../../db/repos/index.js';
import { CreateUserDto, GetUserDto, LoginDto } from '../dto/index.js';
import { Config, RestSchema } from '../config/index.js';
import { SignJWT } from 'jose';
import { UserDocument } from '../../db/models/index.js';
import { HttpError } from '../errors/http.error.js';

@injectable()
export class UserService {
  constructor(
    @inject(Component.UserRepository) private readonly userRepository: UserRepository,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) { }

  public async create(dto: CreateUserDto): Promise<{ user: GetUserDto; token: string }> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser !== null) {
      throw new HttpError(409, 'User with this email already exists.');
    }

    const saltRounds = this.config.get('SALT');
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
    const user = await this.userRepository.create({ ...dto, password: hashedPassword });
    const token = await this.generateJwt({ id: user.id });

    const userDto: GetUserDto = {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      profilePicture: this.getProfilePicturePath(user),
      type: user.type
    };

    return { user: userDto, token };
  }

  public async login(dto: LoginDto): Promise<{ user: GetUserDto; token: string }> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (user === null) {
      throw new HttpError(401, 'Invalid credentials');
    }

    const isPasswordCorrect = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordCorrect) {
      throw new HttpError(401, 'Invalid credentials');
    }

    const token = await this.generateJwt({ id: user.id });

    const userDto: GetUserDto = {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      profilePicture: this.getProfilePicturePath(user),
      type: user.type
    };

    return { user: userDto, token };
  }

  public async findById(id: string): Promise<GetUserDto> {
    const user = await this.userRepository.findById(id);
    if (user === null) {
      throw new HttpError(404, 'Not Found');
    }

    const userDto: GetUserDto = {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      profilePicture: this.getProfilePicturePath(user),
      type: user.type
    };

    return userDto;
  }

  public async uploadProfilePicture(userId: string, fileName: string): Promise<string> {
    const user = await this.userRepository.edit(userId, { profilePicture: fileName });
    if (user === null) {
      throw new HttpError(404, 'Not Found');
    }
    return this.getProfilePicturePath(user);
  }

  private getProfilePicturePath(user: UserDocument): string {
    return user.profilePicture ? `/static/${user.profilePicture}` : '/static/default-profile.jpg';
  }

  private async generateJwt(payload: { id: string }): Promise<string> {
    const secret = this.config.get('JWT_SECRET');
    const encodedSecret = new TextEncoder().encode(secret);

    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(encodedSecret);
  }
}
