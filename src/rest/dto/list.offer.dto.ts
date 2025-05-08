import { City, HousingType } from '../../types/index.js';

export class ListOfferDTO {
  rentalCost!: number;
  name!: string;
  housingType!: HousingType;
  isFavorite!: boolean;
  createdAt!: Date;
  city!: City;
  preview!: string;
  isPremium!: boolean;
  rating!: number;
  commentsCount!: number;
}

