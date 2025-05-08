import { inject, injectable } from 'inversify';
import { Component } from '../component.js';
import { CommentRepository, OfferRepository, UserRepository } from '../../db/repos/index.js';
import { CreateOfferDTO, EditOfferDTO, GetOfferDto, GetUserDto, ListOfferDTO } from '../dto/index.js';

@injectable()
export class OfferService {
  constructor(
    @inject(Component.OfferRepository) private readonly offerRepository: OfferRepository,
    @inject(Component.CommentRepository) private readonly commentRepository: CommentRepository,
    @inject(Component.UserRepository) private readonly userRepository: UserRepository,
  ) { }

  async create(userId: string, dto: CreateOfferDTO): Promise<string> {
    const offer = await this.offerRepository.create({ authorId: userId, ...dto });
    return offer.id;
  }

  async edit(userId: string, offerId: string, dto: EditOfferDTO): Promise<string | null> {
    const offer = await this.offerRepository.edit(offerId, dto);
    return offer?.id;
  }

  async delete(userId: string, offerId: string): Promise<boolean> {
    const deleted = await this.offerRepository.delete(offerId);
    await this.commentRepository.deleteByOfferId(offerId);
    return deleted;
  }

  async list(userId: string, limit: number = 60): Promise<ListOfferDTO[]> {
    const offers = await this.offerRepository.listLast(limit);

    return await Promise.all(offers.map(async (offer) => {
      const [isFavorite, rating, commentsCount] = await Promise.all([
        this.offerRepository.isFavorite(offer.id, userId),
        this.commentRepository.getAverageRatingByOfferId(offer.id),
        this.commentRepository.countByOfferId(offer.id),
      ]);

      return {
        rentalCost: offer.rentalCost,
        name: offer.name,
        housingType: offer.housingType,
        isFavorite,
        createdAt: offer.createdAt,
        city: offer.city,
        preview: offer.preview,
        isPremium: offer.isPremium,
        rating: rating ?? 0,
        commentsCount,
      };
    }));
  }

  async listPremium(userId: string, limit: number = 3): Promise<ListOfferDTO[]> {
    const offers = await this.offerRepository.listLastPremium(limit);

    return await Promise.all(offers.map(async (offer) => {
      const [isFavorite, rating, commentsCount] = await Promise.all([
        this.offerRepository.isFavorite(offer.id, userId),
        this.commentRepository.getAverageRatingByOfferId(offer.id),
        this.commentRepository.countByOfferId(offer.id),
      ]);

      return {
        rentalCost: offer.rentalCost,
        name: offer.name,
        housingType: offer.housingType,
        isFavorite,
        createdAt: offer.createdAt,
        city: offer.city,
        preview: offer.preview,
        isPremium: offer.isPremium,
        rating: rating ?? 0,
        commentsCount,
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
        rentalCost: offer.rentalCost,
        name: offer.name,
        housingType: offer.housingType,
        isFavorite: true,
        createdAt: offer.createdAt,
        city: offer.city,
        preview: offer.preview,
        isPremium: offer.isPremium,
        rating: rating ?? 0,
        commentsCount,
      };
    }));
  }

  async addToFavorites(userId: string, offerId: string): Promise<boolean> {
    return await this.offerRepository.addToFavorites(offerId, userId);
  }

  async removeToFavorites(userId: string, offerId: string): Promise<boolean> {
    return await this.offerRepository.removeFromFavorites(offerId, userId);
  }

  async getDetailedInfo(userId: string, offerId: string): Promise<GetOfferDto | null> {
    const offer = await this.offerRepository.findById(offerId);

    if (offer === null) {
      return null;
    }

    const user = await this.userRepository.findById(userId);
    if (user === null) {
      return null;
    }

    const author: GetUserDto = {
      name: user.name,
      email: user.email,
      type: user.type,
    };

    const [isFavorite, rating, commentsCount] = await Promise.all([
      this.offerRepository.isFavorite(offer.id, userId),
      this.commentRepository.getAverageRatingByOfferId(offer.id),
      this.commentRepository.countByOfferId(offer.id),
    ]);

    const offerDto: GetOfferDto = {
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
      author,
      location: offer.location,
      commentsCount,
    };

    return offerDto;
  }
}
