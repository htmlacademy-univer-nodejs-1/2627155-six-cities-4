import { BaseController } from '../../libs/controller/index.js';
import { CreateCommentDto, CreateOfferDTO, EditOfferDTO, GetCommentDto, GetOfferDto, ListOfferDTO } from '../dto/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../component.js';
import { CommentService, OfferService } from '../services/index.js';
import { Request, Response } from 'express';
import { ValidateObjectIdMiddleware } from '../middlewares/validate.object.id.middleware.js';
import { ValidateDtoMiddleware } from '../middlewares/dto.middleware.js';
import { CheckDocumentExistsMiddleware } from '../middlewares/check.document.exists.middleware.js';
import { OfferRepository } from '../../db/repos/index.js';


@injectable()
export class OfferController extends BaseController {
  public readonly path = '/offers';

  constructor(
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferRepository) private readonly offerRepository: OfferRepository,
  ) {
    super();
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.bindRoute({
      method: 'get',
      path: `${this.path}`,
      handler: this.listOffers.bind(this)
    });
    this.bindRoute({
      method: 'post',
      path: `${this.path}`,
      handler: this.createOffer.bind(this),
      middlewares: [new ValidateDtoMiddleware(CreateOfferDTO)]
    });
    this.bindRoute({
      method: 'get',
      path: `${this.path}/:offerId`,
      handler: this.getDeatailedOfferInfo.bind(this),
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
    });
    this.bindRoute({
      method: 'patch',
      path: `${this.path}/:offerId`,
      handler: this.editOffer.bind(this),
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(EditOfferDTO),
        new CheckDocumentExistsMiddleware(this.offerRepository, 'offerId'),
      ]
    });
    this.bindRoute({
      method: 'delete',
      path: `${this.path}/:offerId`,
      handler: this.deleteOffer.bind(this),
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new CheckDocumentExistsMiddleware(this.offerRepository, 'offerId')],
    });
    this.bindRoute({
      method: 'get',
      path: `${this.path}/:offerId/comments`,
      handler: this.getComments.bind(this),
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new CheckDocumentExistsMiddleware(this.offerRepository, 'offerId'),
      ],
    });
    this.bindRoute({
      method: 'post',
      path: `${this.path}/:offerId/comments`,
      handler: this.createComment.bind(this),
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(CreateCommentDto),
        new CheckDocumentExistsMiddleware(this.offerRepository, 'offerId'),
      ]
    });
  }

  private async listOffers(_req: Request, res: Response<ListOfferDTO[]>) {
    const userId = res.locals.userId;
    const offers = await this.offerService.list(userId);
    this.sendOk(res, offers);
  }

  private async createOffer(req: Request, res: Response<GetOfferDto>) {
    const userId = res.locals.userId;
    const offer = await this.offerService.create(userId, req.body);
    this.sendOk(res, offer);
  }

  private async getDeatailedOfferInfo(req: Request, res: Response<GetOfferDto>) {
    const userId = res.locals.userId;
    const offerId = req.params.offerId;
    const offer = await this.offerService.getDetailedInfo(userId, offerId);
    this.sendOk(res, offer);
  }

  private async editOffer(req: Request, res: Response<GetOfferDto>) {
    const userId = res.locals.userId;
    const offerId = req.params.offerId;
    const offer = await this.offerService.edit(userId, offerId, req.body);
    this.sendOk(res, offer);
  }

  private async deleteOffer(req: Request, res: Response) {
    const userId = res.locals.userId;
    const offerId = req.params.offerId;
    await this.offerService.delete(userId, offerId);
    this.sendOk(res, {});
  }

  private async getComments(req: Request, res: Response<GetCommentDto[]>) {
    const userId = res.locals.userId;
    const offerId = req.params.offerId;
    const comments = await this.commentService.list(userId, offerId);
    this.sendOk(res, comments);
  }

  private async createComment(req: Request, res: Response<GetCommentDto>) {
    const userId = res.locals.userId;
    const offerId = req.params.offerId;
    const comments = await this.commentService.create(userId, offerId, req.body);
    this.sendOk(res, comments);
  }
}
