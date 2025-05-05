import { City, Convenience, Coordinates, HousingType, UserType } from '../types/index.js';

export type UserDto = {
  id: string,
  name: string;
  email: string;
  profilePicture?: string;
  password: string;
  type: UserType;
}

export type OfferDTO = {
  id: string,
  name: string;
  description: string;
  createdAt: Date;
  city: City;
  preview: string;
  housingPhotos: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: HousingType;
  roomsNumber: number;
  guestsNumber: number;
  rentalCost: number;
  conveniences: Convenience[];
  authorId: string;
  location: Coordinates;
}
