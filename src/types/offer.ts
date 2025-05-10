export type City = 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf'

export type HousingType = 'apartment' | 'house' | 'room' | 'hotel'

export type Convenience = 'Breakfast' | 'Air conditioning' | 'Laptop friendly workspace' | 'Baby seat' | 'Washer' | 'Towels' | 'Fridge'

export type Coordinates = {
  latitude: number;
  longitude: number;
}

export type Offer = {
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
  location: Coordinates;
  authorId: string;
}

export type WithOfferId = {
  offerId: string;
}
