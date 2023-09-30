import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Config, ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;
  let httpTestingController: HttpTestingController;

  const testConfig: Config = { api: { graphql: 'http://localhost:8080/graphql' } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ConfigService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load config', async () => {
    await service.loadConfig();

    const req = httpTestingController.expectOne('./assets/config.json');
    req.flush(testConfig);

    expect(service.config).toEqual(testConfig);
    expect(service.configLoaded).toEqual(true);
    expect(req.request.method).toEqual('GET');
  });

  it('failed load config', async () => {
    await service.loadConfig();

    const req = httpTestingController.expectOne('./assets/config.json');
    req.flush('error', { status: 404, statusText: 'Not Found' });

    expect(service.config).toEqual(undefined);
    expect(service.configLoaded).toEqual(false);
    expect(req.request.method).toEqual('GET');
  });
});
