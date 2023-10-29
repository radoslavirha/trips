import { $log } from '@tsed/common';
import { Required } from '@tsed/schema';
import { ConfigLoder } from '.';

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
  it('should pass', async () => {
    const loader = new ConfigLoder('test', 4000, ConfigModel);

    expect(loader.service).toEqual('test');
    expect(loader.port).toEqual(4000);
    expect(loader.api).toEqual({ service: 'test', version: expect.any(String) });
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
  });

  it('should fail', async () => {
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