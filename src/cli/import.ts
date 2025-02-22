import * as fs from 'node:fs';
import { RentalOffer, User, Coordinates } from '../types.js';


const parseRentalOfferTSVRow = (row: string) => {
  const values = row.trim().split('\t');
  return {
    name: values[0],
    description: values[1],
    postedAt: new Date(values[2]),
    city: values[3],
    previewUrl: values[4],
    housingPhotoUrls: values[5].split(',').map((x) => x.trim()),
    isPremium: values[6] === 'true',
    isFavorite: values[7] === 'true',
    rating: Number(values[8]),
    housingType: values[9],
    roomsNumber: parseInt(values[10], 10),
    guestsNumber: parseInt(values[11], 10),
    rentalCost: Number(values[12]),
    conveniences: values[13].split(',').map((x) => x.trim()),
    author: {
      name: values[14],
      email: values[15],
      profilePictureUrl: values[16],
      password: values[17],
      type: values[18],
    } as User,
    location: {
      longitude: Number(values[19]),
      latitude: Number(values[20]),
    } as Coordinates
  } as RentalOffer;
};

export const importData = (path: string) => {
  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) {
      throw new Error(`Не удалось открыть файл ${path}`);
    }
    for (const row of data.trim().split('\n').slice(1)) {
      const rentalOffer = parseRentalOfferTSVRow(row);
      console.log(rentalOffer);
    }
  });
};
