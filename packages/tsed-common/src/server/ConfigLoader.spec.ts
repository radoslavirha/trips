import { $log } from '@tsed/common';
import { Required } from '@tsed/schema';
import { ConfigLoder } from '.';
import { SwaggerDocsVersion } from '../types';

// Must match the config file in config/test.json
class ConfigModel {
  @Required()
  test!: string;
}

class ConfigModelInvalid extends ConfigModel {
  @Required()
  test2!: string;
}

describe('ConfigLoder', () => {
  it('Should pass', async () => {
    const loader = new ConfigLoder('test', 4000, ConfigModel);

    expect(loader.service).toEqual('test');
    expect(loader.port).toEqual(4000);
    expect(loader.api).toEqual({ service: 'test', version: expect.any(String) });
    expect(loader.isProduction).toEqual(false);
    expect(loader.config).toEqual({ test: 'value' });
    expect(loader.server).toEqual({
      httpPort: 4000,
      acceptMimes: ['application/json'],
      httpsPort: false,
      exclude: ['**/*.spec.ts'],
      disableComponentsScan: true,
      jsonMapper: {
        additionalProperties: false
      },
      envs: expect.any(Object)
    });
    expect(loader.swagger).toEqual([
      expect.objectContaining({
        path: `/${SwaggerDocsVersion.GLOBAL}/docs`,
        doc: SwaggerDocsVersion.GLOBAL,
        specVersion: '3.0.1',
        spec: expect.objectContaining({
          info: expect.objectContaining({
            title: 'test',
            version: expect.any(String)
          })
        })
      }),
      expect.objectContaining({
        path: `/${SwaggerDocsVersion.V1}/docs`,
        doc: SwaggerDocsVersion.V1,
        specVersion: '3.0.1',
        spec: expect.objectContaining({
          info: expect.objectContaining({
            title: 'test',
            version: expect.any(String)
          })
        })
      })
    ]);
  });

  it('Should pass - isProduction', async () => {
    const loader = new ConfigLoder('test', 4000, ConfigModel);
    loader._envs.NODE_ENV = 'production';

    expect(loader.isProduction).toEqual(true);
  });

  it('Should pass - isTest', async () => {
    const loader = new ConfigLoder('test', 4000, ConfigModel);
    loader._envs.NODE_ENV = 'test';

    expect(loader.isTest).toEqual(true);
  });

  it('Should fail', async () => {
    const spy = jest.spyOn($log, 'error').mockImplementation();

    try {
      new ConfigLoder('test', 4000, ConfigModelInvalid);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toEqual('Invalid configuration!');
      expect(spy).toBeCalledWith(expect.stringContaining('Config file: '));
    }
  });
});
