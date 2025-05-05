import { UserDocument } from '../models/index.js';

export interface UserRepository {
  create(data: Partial<UserDocument>): Promise<UserDocument>;
  findById(id: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
}
