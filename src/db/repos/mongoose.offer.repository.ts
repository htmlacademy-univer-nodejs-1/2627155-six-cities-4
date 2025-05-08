import { injectable } from 'inversify';
import { FavoriteModel, OfferDocument, OfferModel } from '../models/index.js';
import { OfferRepository } from './offer.repository.interface.js';
import { Offer } from '../../types/index.js';
import { Types } from 'mongoose';

@injectable()
export class MongooseOfferRepository implements OfferRepository {
  async create(data: Offer): Promise<OfferDocument> {
    const offer = new OfferModel(data);
    return await offer.save();
  }

  async edit(id: string, data: Partial<Offer>): Promise<OfferDocument | null> {
    return await OfferModel.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );
  }

  async findById(id: string): Promise<OfferDocument | null> {
    return await OfferModel.findById(id).exec();
  }

  async isFavorite(offerId: string, userId: string): Promise<boolean> {
    const favorite = await FavoriteModel.findOne({ offerId, userId }).exec();
    return favorite !== null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await OfferModel.deleteOne({ _id: new Types.ObjectId(id) }).exec();
    return result.deletedCount !== 0;
  }

  async listLast(limit: number): Promise<OfferDocument[]> {
    return await OfferModel.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async listLastPremium(limit: number): Promise<OfferDocument[]> {
    return await OfferModel.find({ isPremium: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async listFavorites(userId: string): Promise<OfferDocument[]> {
    const favoriteOffers = await FavoriteModel.find({ userId }).select('offerId').exec();
    const offerIds = favoriteOffers.map((fav) => fav.offerId);

    return await OfferModel.find({ _id: { $in: offerIds } })
      .sort({ createdAt: -1 })
      .exec();
  }

  async addToFavorites(offerId: string, userId: string): Promise<boolean> {
    if (await this.isFavorite(offerId, userId)) {
      return false;
    }
    const favorite = new FavoriteModel({ offerId, userId });
    favorite.save();
    return true;
  }

  async removeFromFavorites(offerId: string, userId: string): Promise<boolean> {
    if (!await this.isFavorite(offerId, userId)) {
      return false;
    }
    await FavoriteModel.deleteOne({ offerId, userId }).exec();
    return true;
  }
}
