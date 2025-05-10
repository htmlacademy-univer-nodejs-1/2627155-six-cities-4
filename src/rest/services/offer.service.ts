import { inject, injectable } from 'inversify';
import { Component } from '../component.js';
import { CommentRepository, OfferRepository } from '../../db/repos/index.js';
import { CreateOfferDTO, EditOfferDTO, GetOfferDto, ListOfferDTO } from '../dto/index.js';
import { HttpError } from '../errors/http.error.js';
import { City } from '../../types/index.js';

@injectable()
export class OfferService {
  constructor(
    @inject(Component.OfferRepository) private readonly offerRepository: OfferRepository,
    @inject(Component.CommentRepository) private readonly commentRepository: CommentRepository,
  ) { }

  async create(userId: string, dto: CreateOfferDTO): Promise<GetOfferDto> {
    const offer = await this.offerRepository.create({ authorId: userId, ...dto });

    return {
      id: offer.id.toString(),
      name: offer.name,
      description: offer.description,
      createdAt: offer.createdAt,
      city: offer.city,
      preview: offer.preview,
      housingPhotos: offer.housingPhotos,
      isPremium: offer.isPremium,
      isFavorite: false,
      rating: 0,
      housingType: offer.housingType,
      roomsNumber: offer.roomsNumber,
      guestsNumber: offer.guestsNumber,
      rentalCost: offer.rentalCost,
      conveniences: offer.conveniences,
      authorId: userId.toString(),
      location: offer.location,
      commentsCount: 0
    };
  }

  async edit(userId: string, offerId: string, dto: EditOfferDTO): Promise<GetOfferDto> {
    const offer = await this.offerRepository.findById(offerId);
    if (offer === null) {
      throw new HttpError(404, 'Not found');
    }
    if (offer.authorId.toString() !== userId) {
      throw new HttpError(403, 'Forbidden');
    }

    const editedOffer = await this.offerRepository.edit(offerId, dto);
    if (editedOffer === null) {
      throw new HttpError(404, 'Not found');
    }

    const [isFavorite, rating, commentsCount] = await Promise.all([
      this.offerRepository.isFavorite(editedOffer.id, userId),
      this.commentRepository.getAverageRatingByOfferId(editedOffer.id),
      this.commentRepository.countByOfferId(editedOffer.id),
    ]);

    return {
      id: editedOffer.id.toString(),
      name: editedOffer.name,
      description: editedOffer.description,
      createdAt: editedOffer.createdAt,
      city: editedOffer.city,
      preview: editedOffer.preview,
      housingPhotos: editedOffer.housingPhotos,
      isPremium: editedOffer.isPremium,
      isFavorite,
      rating: rating ?? 0,
      housingType: editedOffer.housingType,
      roomsNumber: editedOffer.roomsNumber,
      guestsNumber: editedOffer.guestsNumber,
      rentalCost: editedOffer.rentalCost,
      conveniences: editedOffer.conveniences,
      authorId: editedOffer.authorId.toString(),
      location: editedOffer.location,
      commentsCount
    };
  }

  async delete(userId: string, offerId: string): Promise<boolean> {
    const offer = await this.offerRepository.findById(offerId);
    if (offer === null) {
      throw new HttpError(404, 'Not found');
    }
    if (offer.authorId.toString() !== userId) {
      throw new HttpError(403, 'Forbidden');
    }
    const deleted = await this.offerRepository.delete(offerId);
    await this.commentRepository.deleteByOfferId(offerId);
    return deleted;
  }

  async list(userId: string | null, limit: number = 60): Promise<ListOfferDTO[]> {
    const offers = await this.offerRepository.listLast(limit);

    return await Promise.all(offers.map(async (offer) => {
      const isFavorite = userId
        ? await this.offerRepository.isFavorite(offer.id, userId)
        : false;

      const [rating, commentsCount] = await Promise.all([
        this.commentRepository.getAverageRatingByOfferId(offer.id),
        this.commentRepository.countByOfferId(offer.id),
      ]);

      return {
        id: offer.id.toString(),
        rentalCost: offer.rentalCost,
        name: offer.name,
        housingType: offer.housingType,
        isFavorite,
        createdAt: offer.createdAt,
        city: offer.city,
        preview: offer.preview,
        isPremium: offer.isPremium,
        rating: rating ?? 0,
        commentsCount
      };
    }));
  }

  async listPremium(userId: string | null, city: City, limit: number = 3): Promise<ListOfferDTO[]> {
    const offers = await this.offerRepository.listLastPremium(city, limit);

    return await Promise.all(offers.map(async (offer) => {
      const isFavorite = userId
        ? await this.offerRepository.isFavorite(offer.id, userId)
        : false;

      const [rating, commentsCount] = await Promise.all([
        this.commentRepository.getAverageRatingByOfferId(offer.id),
        this.commentRepository.countByOfferId(offer.id),
      ]);
      return {
        id: offer.id.toString(),
        rentalCost: offer.rentalCost,
        name: offer.name,
        housingType: offer.housingType,
        isFavorite,
        createdAt: offer.createdAt,
        city: offer.city,
        preview: offer.preview,
        isPremium: offer.isPremium,
        rating: rating ?? 0,
        commentsCount
      };
    }));
  }

  async listFavorite(userId: string): Promise<ListOfferDTO[]> {
    const offers = await this.offerRepository.listFavorites(userId);

    return await Promise.all(offers.map(async (offer) => {
      const [rating, commentsCount] = await Promise.all([
        this.commentRepository.getAverageRatingByOfferId(offer.id),
        this.commentRepository.countByOfferId(offer.id),
      ]);

      return {
        id: offer.id.toString(),
        rentalCost: offer.rentalCost,
        name: offer.name,
        housingType: offer.housingType,
        isFavorite: true,
        createdAt: offer.createdAt,
        city: offer.city,
        preview: offer.preview,
        isPremium: offer.isPremium,
        rating: rating ?? 0,
        commentsCount
      };
    }));
  }

  async addToFavorites(userId: string, offerId: string): Promise<void> {
    const isFavorite = await this.offerRepository.isFavorite(offerId, userId);
    if (isFavorite) {
      throw new HttpError(409, 'Already in favorites');
    }
    await this.offerRepository.addToFavorites(offerId, userId);
  }

  async removeFromFavorites(userId: string, offerId: string): Promise<void> {
    const isFavorite = await this.offerRepository.isFavorite(offerId, userId);
    if (!isFavorite) {
      throw new HttpError(404, 'Not in favorites');
    }
    await this.offerRepository.removeFromFavorites(offerId, userId);
  }

  async getDetailedInfo(userId: string | null, offerId: string): Promise<GetOfferDto> {
    const offer = await this.offerRepository.findById(offerId);
    if (offer === null) {
      throw new HttpError(404, 'Not found');
    }

    const isFavorite = userId
      ? await this.offerRepository.isFavorite(offer.id, userId)
      : false;

    const [rating, commentsCount] = await Promise.all([
      this.commentRepository.getAverageRatingByOfferId(offer.id),
      this.commentRepository.countByOfferId(offer.id),
    ]);

    return {
      id: offer.id.toString(),
      name: offer.name,
      description: offer.description,
      createdAt: offer.createdAt,
      city: offer.city,
      preview: offer.preview,
      housingPhotos: offer.housingPhotos,
      isPremium: offer.isPremium,
      isFavorite,
      rating: rating ?? 0,
      housingType: offer.housingType,
      roomsNumber: offer.roomsNumber,
      guestsNumber: offer.guestsNumber,
      rentalCost: offer.rentalCost,
      conveniences: offer.conveniences,
      authorId: offer.authorId.toString(),
      location: offer.location,
      commentsCount
    };
  }
}
