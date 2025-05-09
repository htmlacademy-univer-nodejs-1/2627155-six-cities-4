import { inject, injectable } from 'inversify';
import { Component } from '../component.js';
import { CommentRepository, OfferRepository } from '../../db/repos/index.js';
import { CreateOfferDTO, EditOfferDTO, GetOfferDto, ListOfferDTO } from '../dto/index.js';

@injectable()
export class OfferService {
  constructor(
    @inject(Component.OfferRepository) private readonly offerRepository: OfferRepository,
    @inject(Component.CommentRepository) private readonly commentRepository: CommentRepository,
  ) { }

  async create(userId: string, dto: CreateOfferDTO): Promise<GetOfferDto> {
    const offer = await this.offerRepository.create({ authorId: userId, ...dto });
    return {
      ...offer,
      id: offer.id,
      isFavorite: false,
      rating: 0,
      commentsCount: 0,
      authorId: userId.toString()
    };
  }

  async edit(userId: string, offerId: string, dto: EditOfferDTO): Promise<GetOfferDto | null> {
    const offer = await this.offerRepository.edit(offerId, dto);
    if (offer === null) {
      return null;
    }
    const [isFavorite, rating, commentsCount] = await Promise.all([
      this.offerRepository.isFavorite(offer.id, userId),
      this.commentRepository.getAverageRatingByOfferId(offer.id),
      this.commentRepository.countByOfferId(offer.id),
    ]);
    return {
      ...offer,
      id: offer.id.toString(),
      authorId: offer.authorId.toString(),
      isFavorite,
      rating: rating ?? 0,
      commentsCount
    };
  }

  async delete(_userId: string, offerId: string): Promise<boolean> {
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
        ...offer,
        id: offer.id,
        isFavorite,
        rating: rating ?? 0,
        commentsCount
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
        ...offer,
        id: offer.id,
        isFavorite,
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
        ...offer,
        id: offer.id,
        isFavorite: true,
        rating: rating ?? 0,
        commentsCount
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

    const [isFavorite, rating, commentsCount] = await Promise.all([
      this.offerRepository.isFavorite(offer.id, userId),
      this.commentRepository.getAverageRatingByOfferId(offer.id),
      this.commentRepository.countByOfferId(offer.id),
    ]);

    return {
      ...offer,
      id: offer.id,
      isFavorite,
      rating: rating ?? 0,
      authorId: offer.authorId.toString(),
      commentsCount,
    };
  }
}
