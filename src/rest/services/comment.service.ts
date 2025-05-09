import { inject, injectable } from 'inversify';
import { Component } from '../component.js';
import { CommentRepository } from '../../db/repos/index.js';
import { CreateCommentDto, GetCommentDto } from '../dto/index.js';

@injectable()
export class CommentService {
  constructor(
    @inject(Component.CommentRepository) private readonly commentRepository: CommentRepository,
  ) { }

  async list(_userId: string, offerId: string, limit: number = 50): Promise<GetCommentDto[]> {
    const comments = await this.commentRepository.listLastByOfferId(offerId, limit);

    return await Promise.all(comments.map(async (comment) => ({
      ...comment,
      id: comment.id.toString(),
      authorId: comment.authorId.toString()
    })));
  }

  async create(userId: string, offerId: string, createDto: CreateCommentDto): Promise<string> {
    const comment = await this.commentRepository.create({ authorId: userId, offerId, ...createDto });
    return comment.id;
  }
}
