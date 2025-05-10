import { City, HousingType, Convenience, Coordinates } from '../../types/index.js';


export class GetOfferDto {
  id!: string;
  name!: string;
  description!: string;
  createdAt!: Date;
  city!: City;
  preview!: string;
  housingPhotos!: string[];
  isPremium!: boolean;
  isFavorite!: boolean;
  rating!: number;
  housingType!: HousingType;
  roomsNumber!: number;
  guestsNumber!: number;
  rentalCost!: number;
  conveniences!: Convenience[];
  authorId!: string;
  location!: Coordinates;
  commentsCount!: number;
}
