import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';
import { Server } from './Server';
import { TestMongooseContext } from '@tsed/testing-mongoose';

describe('Server', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(TestMongooseContext.bootstrap(Server));
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(TestMongooseContext.reset);

  it('should call GET /rest', async () => {
    const response = await request.get('/rest').expect(404);

    expect(response.body).toEqual({
      errors: [],
      message: 'Resource "/rest" not found',
      name: 'NOT_FOUND',
      status: 404
    });
  });
});
