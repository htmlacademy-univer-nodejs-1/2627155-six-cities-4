import { City, HousingType, Convenience, Coordinates } from '../../types/index.js';
import { GetUserDto } from './get.user.dto.js';


export class GetOfferDto {
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
  author!: GetUserDto;
  location!: Coordinates;
  commentsCount!: number;
}
