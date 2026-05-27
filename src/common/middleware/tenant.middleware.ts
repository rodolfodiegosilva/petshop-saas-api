import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { DynamicTenantResolver } from '../../modules/tenants/dynamic-tenant.resolver';
import { tenantStorage } from './tenant-context';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly resolver: DynamicTenantResolver) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = await this.resolver.resolve({
        origin: req.headers.origin,
        host: req.headers.host,
        tenantId: req.headers['x-tenant-id'],
        apiKey: req.headers['x-api-key'],
      });

      tenantStorage.run(tenantId, () => next());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Tenant could not be resolved.';
      res.status(400).json({ statusCode: 400, message, error: 'Bad Request' });
    }
  }
}
