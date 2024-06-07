import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type ExternalHealthCheck = z.infer<typeof externalHealthCheckchema>;
export const externalHealthCheckchema = z.object({
  url: z.string(),
  priority: z.number(),
  online: z.boolean().optional(),
});
