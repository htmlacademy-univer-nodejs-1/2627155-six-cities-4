import { injectable } from 'inversify';
import { CommentDocument, CommentModel } from '../models/index.js';
import { CommentRepository } from './comment.repository.interface.js';
import { Comment } from '../../types/index.js';
import { Types } from 'mongoose';

@injectable()
export class MongooseCommentRepository implements CommentRepository {

  async listLastByOfferId(offerId: string, limit: number): Promise<CommentDocument[]> {
    return await CommentModel.find({ offer: offerId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async create(data: Comment): Promise<CommentDocument> {
    const user = new CommentModel(data);
    return await user.save();
  }

  async findById(id: string): Promise<CommentDocument | null> {
    return await CommentModel.findById(id).exec();
  }

  async getAverageRatingByOfferId(offerId: string): Promise<number | null> {
    const result = await CommentModel.aggregate([
      {
        $match: {
          offerId: new Types.ObjectId(offerId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
        },
      },
    ]);

    return result.length > 0 ? result[0].averageRating : null;
  }

  async countByOfferId(offerId: string): Promise<number> {
    return await CommentModel.countDocuments({ offerId: new Types.ObjectId(offerId) });
  }

  async deleteByOfferId(offerId: string): Promise<number> {
    const result = await CommentModel.deleteMany({ offerId: new Types.ObjectId(offerId) });
    return result.deletedCount;
  }
}
