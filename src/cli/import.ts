import fs from 'node:fs';
import readline from 'node:readline';
import { Offer, User, Coordinates } from '../types/index.js';
import { connect, disconnect } from 'mongoose';
import { MongooseOfferRepository, MongooseUserRepository } from '../db/repos/index.js';


const parseOfferTSVRow = (row: string) => {
  const values = row.trim().split('\t');
  return {
    name: values[0],
    description: values[1],
    createdAt: new Date(values[2]),
    city: values[3],
    preview: values[4],
    housingPhotos: values[5].split(',').map((x) => x.trim()),
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
      profilePicture: values[16],
      password: values[17],
      type: values[18],
    } as User,
    location: {
      longitude: Number(values[19]),
      latitude: Number(values[20]),
    } as Coordinates
  } as Offer;
};

export const importData = async (path: string, mongoUrl: string) => {
  console.log(`Подключение к MongoDB по пути ${mongoUrl}`);
  await connect(mongoUrl);
  console.log('Подключено к MongoDB');
  const offerRepository = new MongooseOfferRepository();
  const userRepository = new MongooseUserRepository();

  const stream = fs.createReadStream(path, 'utf-8');
  const rl = readline.createInterface({
    input: stream,
    output: process.stdout,
    terminal: false
  });

  const offers: Offer[] = [];

  rl.on('line', (line) => {
    if (line.trim()) {
      offers.push(parseOfferTSVRow(line));
    }
  });

  rl.on('close', async () => {
    for (const offer of offers) {
      const createdUser = await userRepository.create(offer.author);
      console.log(`Создан пользователь ${createdUser.id}`);
      const createdOffer = await offerRepository.create({ authorId: createdUser.id, ...offer });
      console.log(`Создано предложение ${createdOffer.id}`);
    }
    disconnect();
    console.log('Импорт данных завершен');
  });

  rl.on('error', (err) => {
    console.error(`Ошибка при чтении файла: ${err.message}`);
  });
};
