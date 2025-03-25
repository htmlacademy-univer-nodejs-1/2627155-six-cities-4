import { City, Convenience, Coordinates, HousingType, UserType } from '../common/types.js';

export type UserDto = {
  id: string,
  name: string;
  email: string;
  profilePicture?: URL;
  password: string;
  type: UserType;
}

export type OfferDTO = {
  id: string,
  name: string;
  description: string;
  postedAt: Date;
  city: City;
  preview: URL;
  housingPhotos: URL[];
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
