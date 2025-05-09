import { IsString, MinLength, MaxLength, IsIn, IsUrl, IsArray, ArrayMinSize, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { City, Convenience, HousingType } from '../../types/index.js';

export class CreateOfferDTO {
  @IsString()
  @MinLength(10)
  @MaxLength(100)
    name!: string;

  @IsString()
  @MinLength(20)
  @MaxLength(1024)
    description!: string;

  @IsIn(['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'])
    city!: City;

  @IsUrl()
    preview!: string;

  @IsArray()
  @ArrayMinSize(6)
  @IsUrl({}, { each: true })
    housingPhotos!: string[];

  @IsBoolean()
    isPremium!: boolean;

  @IsIn(['apartment', 'house', 'room', 'hotel'])
    housingType!: HousingType;

  @IsInt()
  @Min(1)
  @Max(8)
    roomsNumber!: number;

  @IsInt()
  @Min(1)
  @Max(10)
    guestsNumber!: number;

  @IsInt()
  @Min(100)
  @Max(100000)
    rentalCost!: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsIn(
    [
      'Breakfast',
      'Air conditioning',
      'Laptop friendly workspace',
      'Baby seat',
      'Washer',
      'Towels',
      'Fridge'
    ],
    { each: true }
  )
    conveniences!: Convenience[];

  location!: { latitude: number; longitude: number };
}
