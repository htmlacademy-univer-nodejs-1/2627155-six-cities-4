export type UserType = 'ordinary' | 'pro'

export type City = 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf'

export type HousingType = 'apartment' | 'house' | 'room' | 'hotel'

export type Convenience = 'Breakfast' | 'Air conditioning' | 'Laptop friendly workspace' | 'Baby seat' | 'Washer' | 'Towels' | 'Fridge'

export type Coordinates = {
  latitude: number;
  longitude: number;
}

export type User = {
  name: string;
  email: string;
  profilePicture?: URL;
  password: string;
  type: UserType;
}

export type Offer = {
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
  author: User;
  location: Coordinates;
}

