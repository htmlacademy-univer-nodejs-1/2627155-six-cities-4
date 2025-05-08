import fs from 'node:fs';
import got from 'got';
import { Offer, OfferDTO, User, UserDto } from './types.js';
import { getRandomArbitraryInt, getRandomInt } from '../libs/random/index.js';

const getRandomizedUser = (user: User) => {
  const emailParts = user.email.split('@');
  const email = `${emailParts[0]}${getRandomInt()}@${emailParts[1]}`;
  return {
    name: user.name + getRandomInt(),
    email: email,
    profilePicture: user.profilePicture,
    password: user.password + getRandomInt(),
    type: getRandomInt() % 2 === 0 ? 'ordinary' : 'pro',
  } as User;
};

const getRandomizedOffer = (offer: Offer) => ({
  name: offer.name + getRandomInt(),
  description: offer.description,
  createdAt: offer.createdAt,
  city: offer.city,
  preview: offer.preview,
  housingPhotos: offer.housingPhotos,
  isPremium: getRandomInt() % 2 === 0,
  isFavorite: getRandomInt() % 2 === 0,
  rating: getRandomArbitraryInt(1, 6),
  housingType: offer.housingType,
  roomsNumber: offer.roomsNumber,
  guestsNumber: getRandomArbitraryInt(1, 11),
  rentalCost: getRandomArbitraryInt(100, 100000),
  conveniences: offer.conveniences,
  author: getRandomizedUser(offer.author),
  location: offer.location,
} as Offer);


const getUsers = async (url: string) => await got(`${url}/users`).json<UserDto[]>();

const getOffers = async (url: string) => await got(`${url}/offers`).json<OfferDTO[]>();

const mapOfferDtoIntoOffer = (offer: OfferDTO, users: UserDto[]) => ({
  ...offer,
  author: users.find((user) => user.id === offer.authorId) as User,
} as Offer);

const mapOfferIntoTSV = (offer: Offer) => {
  const fields = [
    offer.name,
    offer.description,
    offer.createdAt,
    offer.city,
    offer.preview,
    offer.housingPhotos.join(','),
    offer.isPremium,
    offer.isFavorite,
    offer.rating,
    offer.housingType,
    offer.roomsNumber,
    offer.guestsNumber,
    offer.rentalCost,
    offer.conveniences.join(','),
    offer.author.name,
    offer.author.email,
    offer.author.profilePicture,
    offer.author.password,
    offer.author.type,
    offer.location.latitude,
    offer.location.longitude,
  ];
  return fields.join('\t');
};

export const generateRandomOffersTSV = async (n: number, path: string, url: string) => {
  if (n < 0) {
    throw new Error('n не может быть отрицательным');
  }
  const offers = await getOffers(url);
  const users = await getUsers(url);

  fs.writeFile(path, '', (err) => {
    if (err) {
      console.error('Ошибка при записи в файл:', err);
      throw err;
    }
  });

  for (let i = 0; i < n; i++) {
    const offerDTO = offers[getRandomArbitraryInt(0, offers.length)];
    const offer = mapOfferDtoIntoOffer(offerDTO, users);
    const randomizedOffer = getRandomizedOffer(offer);
    const offerTSV = mapOfferIntoTSV(randomizedOffer);

    console.log(offerTSV);
    fs.appendFile(path, `${offerTSV}\n`, (err) => {
      if (err) {
        console.error('Ошибка при записи в файл:', err);
        throw err;
      }
    });
  }
  console.log(`Сгенерировано ${n} предложений`);
};

