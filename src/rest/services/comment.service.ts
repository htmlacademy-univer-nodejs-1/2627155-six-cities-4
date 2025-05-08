import { inject, injectable } from 'inversify';
import { Component } from '../component.js';
import { CommentRepository, UserRepository } from '../../db/repos/index.js';
import { CreateCommentDto, GetUserDto, GetCommentDto } from '../dto/index.js';

@injectable()
export class CommentService {
  constructor(
    @inject(Component.CommentRepository) private readonly commentRepository: CommentRepository,
    @inject(Component.UserRepository) private readonly userRepository: UserRepository,
  ) { }

  async list(userId: string, offerId: string, limit: number = 50): Promise<GetCommentDto[]> {
    const comments = await this.commentRepository.listLastByOfferId(offerId, limit);

    const dtos = await Promise.all(comments.map(async (comment) => {
      const author = await this.userRepository.findById(comment.authorId.toString());
      if (author === null) {
        return null;
      }

      const authorDto: GetUserDto = {
        name: author.name,
        email: author.email,
        type: author.type,
      };

      return {
        text: comment.text,
        createdAt: comment.createdAt,
        rating: comment.rating ?? 0,
        author: authorDto,
      };
    }));

    return dtos.filter((dto): dto is GetCommentDto => dto !== null);
  }

  async create(userId: string, offerId: string, createDto: CreateCommentDto): Promise<string> {
    const comment = await this.commentRepository.create({ authorId: userId, offerId, ...createDto });
    return comment.id;
  }
}
