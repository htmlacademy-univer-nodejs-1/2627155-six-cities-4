import { City, HousingType, Convenience, Coordinates } from '../../types/index.js';

export class EditOfferDTO {
  name?: string;
  description?: string;
  city?: City;
  preview?: string;
  housingPhotos?: string[];
  isPremium?: boolean;
  housingType?: HousingType;
  roomsNumber?: number;
  guestsNumber?: number;
  rentalCost?: number;
  conveniences?: Convenience[];
  location?: Coordinates;
}
