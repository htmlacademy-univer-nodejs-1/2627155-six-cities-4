import { OfferDocument } from '../models/index.js';

export interface OfferRepository {
  create(data: Partial<OfferDocument>): Promise<OfferDocument>;
  findById(id: string): Promise<OfferDocument | null>;
}
