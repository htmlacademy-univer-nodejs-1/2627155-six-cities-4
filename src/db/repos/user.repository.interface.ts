import { User } from '../../types/index.js';
import { UserDocument } from '../models/index.js';

export interface UserRepository {
  create(data: User): Promise<UserDocument>;
  findById(id: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
}
