import { Offer } from '../../types/index.js';
import { OfferDocument } from '../models/index.js';

export interface OfferRepository {
  create(data: Offer): Promise<OfferDocument>;
  edit(id: string, data: Partial<Offer>): Promise<OfferDocument | null>;
  findById(id: string): Promise<OfferDocument | null>;
  isFavorite(offerId: string, userId: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  listLast(limit: number): Promise<OfferDocument[]>;
  listLastPremium(limit: number): Promise<OfferDocument[]>;
  listFavorites(userId: string): Promise<OfferDocument[]>;
  addToFavorites(offerId: string, userId: string): Promise<boolean>;
  removeFromFavorites(offerId: string, userId: string): Promise<boolean>;
}
