import { injectable } from 'inversify';
import { OfferDocument, OfferModel } from '../models/offer.js';
import { OfferRepository } from './offer.repository.interface.js';

@injectable()
export class MongooseOfferRepository implements OfferRepository {
  async create(data: Partial<OfferDocument>): Promise<OfferDocument> {
    const offer = new OfferModel(data);
    return await offer.save();
  }

  async findById(id: string): Promise<OfferDocument | null> {
    return await OfferModel.findById(id).exec();
  }
}
