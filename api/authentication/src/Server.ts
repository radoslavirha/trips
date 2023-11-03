import { BaseServer, getServerDefaultConfig, getSwaggerHelmetDirectives } from '@hikers-book/tsed-common/server';
import '@tsed/ajv';
import { Configuration, Inject } from '@tsed/di';
import '@tsed/ioredis';
import '@tsed/mongoose';
import '@tsed/platform-express'; // /!\ keep this import
import '@tsed/swagger';
import cookieSession from 'cookie-session';
import helmet from 'helmet';
import { join } from 'path';
import './connections/Redis';
import * as global from './global/controllers/index';
import { ConfigService } from './services';
import * as v1 from './v1/controllers/index';

@Configuration({
  ...getServerDefaultConfig(), // must be here because of tests
  mount: {
    '/v1': [...Object.values(v1)],
    '/': [...Object.values(global)]
  },
  views: {
    root: join(process.cwd(), '../views'),
    extensions: {
      ejs: 'ejs'
    }
  }
})
export class Server extends BaseServer {
  @Inject()
  configService!: ConfigService;

  $beforeRoutesInit(): void {
    this.registerMiddlewares();

    this.app.getApp().set('trust proxy', true);
    this.app.use(
      cookieSession({
        signed: false,
        secure: !this.configService.isTest,
        ...this.configService.config.session
      })
    );
    this.app.use(
      helmet({
        contentSecurityPolicy: this.configService.isProduction
          ? {
              directives: getSwaggerHelmetDirectives()
            }
          : false
      })
    );
  }
}
