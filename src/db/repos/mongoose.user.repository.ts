import { injectable } from 'inversify';
import { UserDocument, UserModel } from '../models/index.js';
import { UserRepository } from './user.repository.interface.js';

@injectable()
export class MongooseUserRepository implements UserRepository {
  async create(data: Partial<UserDocument>): Promise<UserDocument> {
    const user = new UserModel(data);
    return await user.save();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return await UserModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await UserModel.findOne({ email }).exec();
  }
}
