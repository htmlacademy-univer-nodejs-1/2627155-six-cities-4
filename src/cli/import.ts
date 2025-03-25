import fs from 'node:fs';
import readline from 'node:readline';
import { Offer, User, Coordinates } from '../types.js';


const parseOfferTSVRow = (row: string) => {
  const values = row.trim().split('\t');
  console.log(values);
  return {
    name: values[0],
    description: values[1],
    postedAt: new Date(values[2]),
    city: values[3],
    preview: new URL(values[4]),
    housingPhotos: values[5].split(',').map((x) => new URL(x.trim())),
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
      profilePicture: values[16] ? new URL(values[16]) : null,
      password: values[17],
      type: values[18],
    } as User,
    location: {
      longitude: Number(values[19]),
      latitude: Number(values[20]),
    } as Coordinates
  } as Offer;
};

export const importData = (path: string) => {
  const stream = fs.createReadStream(path, 'utf-8');
  const rl = readline.createInterface({
    input: stream,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', (line) => {
    if (line.trim()) {
      const rentalOffer = parseOfferTSVRow(line);
      console.log(rentalOffer);
    }
  });

  rl.on('close', () => {
    console.log('Импорт данных завершен');
  });

  rl.on('error', (err) => {
    console.error(`Ошибка при чтении файла: ${err.message}`);
  });
};
