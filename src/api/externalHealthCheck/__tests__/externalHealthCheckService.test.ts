import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

import { checkServer, externalHealthCheckService } from '../externalHealthCheckService';

describe('External health check API endpoints', () => {
  describe('checkServer', () => {
    afterEach(() => {
      vi.resetAllMocks();
      vi.resetAllMocks();
    });

    it('Server is offline', async () => {
      const mockedServer = {
        url: 'https://does-not-work.perfume.new',
        priority: 1,
      };

      vi.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ status: 500, data: {} }));

      const result = await checkServer(mockedServer);

      expect(result).toEqual({ ...mockedServer, online: false });
    });

    it('Server is online', async () => {
      const mockedServer = {
        url: 'https://does-not-work.perfume.new',
        priority: 1,
      };

      vi.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ status: 200, data: {} }));

      const result = await checkServer(mockedServer);

      expect(result).toEqual({ ...mockedServer, online: true });
    });
  });

  describe('findServer', () => {
    afterEach(() => {
      vi.resetAllMocks();
      vi.resetAllMocks();
    });

    it('All server is offline', async () => {
      const mockedMessage = 'Error finding all server: No servers are online';
      const mockedResult = null;
      const mockedStatus = 500;

      vi.spyOn(axios, 'get').mockReturnValue(Promise.resolve({ status: mockedStatus }));

      const result = await externalHealthCheckService.findServer();

      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.responseObject).toEqual(mockedResult);
      expect(result.message).toEqual(mockedMessage);
    });

    it('All server is online', async () => {
      const mockedMessage = 'Found a server';
      const mockedResult = {
        online: true,
        url: 'https://does-not-work.perfume.new',
        priority: 1,
      };
      const mockedStatus = 200;

      vi.spyOn(axios, 'get').mockReturnValue(Promise.resolve({ status: mockedStatus }));

      const result = await externalHealthCheckService.findServer();

      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.responseObject).toEqual(mockedResult);
      expect(result.message).toEqual(mockedMessage);
    });
  });
});
