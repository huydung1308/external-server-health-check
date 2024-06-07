import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

import { ExternalHealthCheck } from './externalHealthCheckModel';
import { serverData } from './serverData';

export const checkServer = async (server: ExternalHealthCheck): Promise<ExternalHealthCheck> => {
  try {
    const response = await axios.get(server.url, { timeout: 5000 });
    return { ...server, online: response.status >= 200 && response.status < 300 };
  } catch (error) {
    return { ...server, online: false };
  }
};

export const externalHealthCheckService = {
  // Retrieves all users from the database
  findServer: async (): Promise<ServiceResponse<ExternalHealthCheck | null>> => {
    try {
      const promises = serverData.map((server) => checkServer(server));
      const responses = await Promise.all(promises);

      const onlineServers = responses.filter((response) => response.online);
      if (!onlineServers.length) {
        throw new Error('No servers are online');
      }

      const severResult = onlineServers.sort((prev, current) => prev.priority - current.priority);

      return new ServiceResponse<ExternalHealthCheck>(
        ResponseStatus.Success,
        'Found a server',
        severResult[0],
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error finding all server: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.NOT_FOUND);
    }
  },
};
