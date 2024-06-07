import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

import { externalHealthCheckService } from './externalHealthCheckService';

export const externalHealthCheckRegistry = new OpenAPIRegistry();

export const externalHealthCheckRouter: Router = (() => {
  const router = express.Router();

  externalHealthCheckRegistry.registerPath({
    method: 'get',
    path: '/external-health-check',
    tags: ['Server External Health Check'],
    responses: createApiResponse(z.null(), 'Success'),
  });

  router.get('/', async (_req: Request, res: Response) => {
    const serviceResponse = await externalHealthCheckService.findServer();
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
