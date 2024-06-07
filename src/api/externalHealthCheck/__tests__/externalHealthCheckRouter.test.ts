import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { app } from '@/server';

import { externalHealthCheckService } from '../externalHealthCheckService';

describe('External health check API endpoints', () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.resetAllMocks();
  });

  it('GET / - fail', async () => {
    const mockedMessage = 'Error finding all server: No servers are online';
    const mockedResult = null;

    vi.spyOn(externalHealthCheckService, 'findServer').mockImplementation(async () => {
      return new ServiceResponse(ResponseStatus.Failed, mockedMessage, mockedResult, StatusCodes.NOT_FOUND);
    });

    const response = await request(app).get('/external-health-check');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.success).toBeFalsy();
    expect(result.responseObject).toEqual(mockedResult);
    expect(result.message).toEqual(mockedMessage);
  });

  it('GET / - success', async () => {
    const mockedMessage = 'Found a server';
    const mockedResult = {
      url: 'http://app.scnt.me',
      priority: 3,
      online: true,
    };

    vi.spyOn(externalHealthCheckService, 'findServer').mockImplementation(async () => {
      return new ServiceResponse(ResponseStatus.Success, mockedMessage, mockedResult, StatusCodes.OK);
    });

    const response = await request(app).get('/external-health-check');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(result.success).toBeTruthy();
    expect(result.responseObject).toEqual(mockedResult);
    expect(result.message).toEqual(mockedMessage);
  });
});
