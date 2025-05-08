import { Schema, model, Types, Document } from 'mongoose';

export interface FavoriteDocument extends Document {
  userId: Types.ObjectId;
  offerId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSchema = new Schema<FavoriteDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  offerId: {
    type: Schema.Types.ObjectId,
    ref: 'Offer',
    required: true,
  },
}, {
  timestamps: true,
});

favoriteSchema.index({ userId: 1, offerId: 1 }, { unique: true });

export const FavoriteModel = model<FavoriteDocument>('Favorite', favoriteSchema);
