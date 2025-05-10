import { IsOptional, IsString, IsIn, IsUrl, IsArray, IsBoolean, IsInt, Min, Max, ValidateNested } from 'class-validator';
import { City, Convenience, HousingType } from '../../types/index.js';
import { Type } from 'class-transformer';
import { LocationDto } from './location.dto.js';

export class EditOfferDTO {
  @IsOptional()
  @IsString()
    name?: string;

  @IsOptional()
  @IsString()
    description?: string;

  @IsOptional()
  @IsIn(['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'])
    city?: City;

  @IsOptional()
  @IsUrl()
    preview?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
    housingPhotos?: string[];

  @IsOptional()
  @IsBoolean()
    isPremium?: boolean;

  @IsOptional()
  @IsIn(['apartment', 'house', 'room', 'hotel'])
    housingType?: HousingType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8)
    roomsNumber?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
    guestsNumber?: number;

  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(100000)
    rentalCost?: number;

  @IsOptional()
  @IsArray()
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
    conveniences?: Convenience[];

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
    location!: LocationDto;
}
