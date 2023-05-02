import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    const page = String(req.query.page);
    const limit = String(req.query.limit);

    req['pagination'] = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 2,
    };

    next();
  }
}