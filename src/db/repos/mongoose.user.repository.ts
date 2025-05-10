import { injectable } from 'inversify';
import { UserDocument, UserModel } from '../models/index.js';
import { UserRepository } from './user.repository.interface.js';
import { User } from '../../types/index.js';

@injectable()
export class MongooseUserRepository implements UserRepository {
  async exists(id: string): Promise<boolean> {
    return await this.findById(id) !== null;
  }

  async create(data: User): Promise<UserDocument> {
    const user = new UserModel(data);
    return await user.save();
  }

  async edit(id: string, data: Partial<User>): Promise<UserDocument | null> {
    return await UserModel.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );
  }

  async findById(id: string): Promise<UserDocument | null> {
    return await UserModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await UserModel.findOne({ email }).exec();
  }
}
