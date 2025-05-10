import { Comment } from '../../types/index.js';
import { CommentDocument } from '../models/index.js';
import { Repository } from './repository.interface.js';

export interface CommentRepository extends Repository {
  create(data: Comment): Promise<CommentDocument>;
  findById(id: string): Promise<CommentDocument | null>;
  listLastByOfferId(offerId: string, limit: number): Promise<CommentDocument[]>;
  getAverageRatingByOfferId(offerId: string): Promise<number | null>;
  countByOfferId(offerId: string): Promise<number>;
  deleteByOfferId(offerId: string): Promise<number>;
}
