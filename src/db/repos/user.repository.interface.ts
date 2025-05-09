import { User } from '../../types/index.js';
import { UserDocument } from '../models/index.js';
import { Repository } from './repository.interface.js';

export interface UserRepository extends Repository {
  create(data: User): Promise<UserDocument>;
  findById(id: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
}
