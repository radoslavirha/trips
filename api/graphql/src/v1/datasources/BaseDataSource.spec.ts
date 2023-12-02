import { PlatformTest } from '@tsed/common';
import { RequestOptions } from 'apollo-datasource-rest';
// @ts-expect-error asdsad
// eslint-disable-next-line import/no-unresolved
import { Headers, URLSearchParams } from 'apollo-server-env';
import { BaseDataSource } from './BaseDataSource';

describe('BaseDataSource', () => {
  let datasource: BaseDataSource;

  beforeAll(PlatformTest.create);
  beforeAll(async () => {
    datasource = await PlatformTest.invoke<BaseDataSource>(BaseDataSource);
  });
  afterAll(PlatformTest.reset);

  it('Should set Authorization header', () => {
    const options: RequestOptions = {
      path: 'path',
      params: new URLSearchParams(),
      headers: new Headers()
    };

    datasource.initialize({
      context: { token: 'token' },
      cache: { get: jest.fn(), set: jest.fn(), delete: jest.fn() }
    });
    datasource.willSendRequest(options);

    expect(options.headers.get('Authorization')).toBe('token');
  });
});