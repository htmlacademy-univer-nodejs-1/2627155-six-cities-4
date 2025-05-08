import { Schema, model, Document, Types } from 'mongoose';
import { Convenience, HousingType, City, Coordinates } from '../../types/index.js';

export interface OfferDocument extends Document {
  name: string;
  description: string;
  city: City;
  preview: string;
  housingPhotos: string[];
  isPremium: boolean;
  housingType: HousingType;
  roomsNumber: number;
  guestsNumber: number;
  rentalCost: number;
  conveniences: Convenience[];
  authorId: Types.ObjectId;
  location: Coordinates;
  createdAt: Date;
  updatedAt: Date;
}

const coordinatesSchema = new Schema<Coordinates>({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
}, { _id: false });

const offerSchema = new Schema<OfferDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  city: { type: String, enum: ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'], required: true },
  preview: { type: String, required: true },
  housingPhotos: [{ type: String, required: true }],
  isPremium: { type: Boolean, required: true },
  housingType: { type: String, enum: ['apartment', 'house', 'room', 'hotel'], required: true },
  roomsNumber: { type: Number, required: true },
  guestsNumber: { type: Number, required: true },
  rentalCost: { type: Number, required: true },
  conveniences: [{
    type: String,
    enum: ['Breakfast', 'Air conditioning', 'Laptop friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge'],
    required: true
  }],
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: coordinatesSchema, required: true }
}, { timestamps: true });

export const OfferModel = model<OfferDocument>('Offer', offerSchema);
