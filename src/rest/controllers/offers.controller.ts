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
import { JwtMiddleware } from '../middlewares/index.js';
import { Config, RestSchema } from '../config/index.js';
import { City } from '../../cli/types.js';


@injectable()
export class OfferController extends BaseController {
  public readonly path = '/offers';

  constructor(
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferRepository) private readonly offerRepository: OfferRepository,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    super();
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.bindRoute({
      method: 'get',
      path: `${this.path}`,
      handler: this.listOffers.bind(this),
      middlewares: [new JwtMiddleware(this.config, 'all')]
    });
    this.bindRoute({
      method: 'get',
      path: `${this.path}/premiums/:city`,
      handler: this.listPremiumOffers.bind(this),
      middlewares: [new JwtMiddleware(this.config, 'all')]
    });
    this.bindRoute({
      method: 'get',
      path: `${this.path}/favorites/me`,
      handler: this.listFavoriteOffers.bind(this),
      middlewares: [new JwtMiddleware(this.config, 'auth')]
    });
    this.bindRoute({
      method: 'post',
      path: `${this.path}`,
      handler: this.createOffer.bind(this),
      middlewares: [
        new JwtMiddleware(this.config, 'auth'),
        new ValidateDtoMiddleware(CreateOfferDTO)
      ]
    });
    this.bindRoute({
      method: 'get',
      path: `${this.path}/:offerId`,
      handler: this.getDeatailedOfferInfo.bind(this),
      middlewares: [
        new JwtMiddleware(this.config, 'all'),
        new ValidateObjectIdMiddleware('offerId'),
        new CheckDocumentExistsMiddleware(this.offerRepository, 'offerId')
      ]
    });
    this.bindRoute({
      method: 'patch',
      path: `${this.path}/:offerId`,
      handler: this.editOffer.bind(this),
      middlewares: [
        new JwtMiddleware(this.config, 'auth'),
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
        new JwtMiddleware(this.config, 'auth'),
        new ValidateObjectIdMiddleware('offerId'),
        new CheckDocumentExistsMiddleware(this.offerRepository, 'offerId')],
    });
    this.bindRoute({
      method: 'get',
      path: `${this.path}/:offerId/comments`,
      handler: this.listComments.bind(this),
      middlewares: [
        new JwtMiddleware(this.config, 'all'),
        new ValidateObjectIdMiddleware('offerId'),
        new CheckDocumentExistsMiddleware(this.offerRepository, 'offerId'),
      ],
    });
    this.bindRoute({
      method: 'post',
      path: `${this.path}/:offerId/comments`,
      handler: this.createComment.bind(this),
      middlewares: [
        new JwtMiddleware(this.config, 'auth'),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(CreateCommentDto),
        new CheckDocumentExistsMiddleware(this.offerRepository, 'offerId'),
      ]
    });
    this.bindRoute({
      method: 'post',
      path: `${this.path}/favorites/:offerId/`,
      handler: this.addToFavorites.bind(this),
      middlewares: [
        new JwtMiddleware(this.config, 'auth'),
        new ValidateObjectIdMiddleware('offerId'),
        new CheckDocumentExistsMiddleware(this.offerRepository, 'offerId')],
    });
    this.bindRoute({
      method: 'delete',
      path: `${this.path}/favorites/:offerId/`,
      handler: this.removeFromFavorites.bind(this),
      middlewares: [
        new JwtMiddleware(this.config, 'auth'),
        new ValidateObjectIdMiddleware('offerId'),
        new CheckDocumentExistsMiddleware(this.offerRepository, 'offerId')],
    });
  }

  private async listOffers(req: Request, res: Response<ListOfferDTO[]>) {
    const userId = res.locals.userId ?? null;

    const limitParam = req.query.limit;
    let limit: number | undefined;
    if (limitParam !== undefined) {
      const parsed = parseInt(limitParam as string, 10);
      if (isNaN(parsed) || parsed <= 0) {
        this.sendBadRequest(res, 'limit query param must be a positive integer');
      }
      limit = parsed;
    }

    const offers = await this.offerService.list(userId, limit);
    this.sendOk(res, offers);
  }

  private async listPremiumOffers(req: Request, res: Response<ListOfferDTO[]>) {
    const userId = res.locals.userId ?? null;
    const city = req.params.city;
    const cities = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'];
    if (!cities.includes(city)) {
      this.sendBadRequest(res, `city must be on of those values: ${cities}`);
    }

    const offers = await this.offerService.listPremium(userId, city as City);
    this.sendOk(res, offers);
  }

  private async listFavoriteOffers(_req: Request, res: Response<ListOfferDTO[]>) {
    const userId = res.locals.userId ?? null;
    const offers = await this.offerService.listFavorite(userId);
    this.sendOk(res, offers);
  }

  private async createOffer(req: Request, res: Response<GetOfferDto>) {
    const userId = res.locals.userId;
    const offer = await this.offerService.create(userId, req.body);
    this.sendCreated(res, offer);
  }

  private async getDeatailedOfferInfo(req: Request, res: Response<GetOfferDto>) {
    const userId = res.locals.userId ?? null;
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
    this.sendNoContent(res);
  }

  private async listComments(req: Request, res: Response<GetCommentDto[]>) {
    const offerId = req.params.offerId;
    const comments = await this.commentService.list(offerId);
    this.sendOk(res, comments);
  }

  private async createComment(req: Request, res: Response<GetCommentDto>) {
    const userId = res.locals.userId;
    const offerId = req.params.offerId;
    const comments = await this.commentService.create(userId, offerId, req.body);
    this.sendCreated(res, comments);
  }

  private async addToFavorites(req: Request, res: Response) {
    const userId = res.locals.userId;
    const offerId = req.params.offerId;
    await this.offerService.addToFavorites(userId, offerId);
    this.sendNoContent(res);
  }

  private async removeFromFavorites(req: Request, res: Response) {
    const userId = res.locals.userId;
    const offerId = req.params.offerId;
    await this.offerService.removeFromFavorites(userId, offerId);
    this.sendNoContent(res);
  }
}
