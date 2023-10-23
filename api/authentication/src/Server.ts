import { BaseServer } from '@hikers-book/tsed-common/server';
import { ConfigServiceBase } from '@hikers-book/tsed-common/services';
import { getHelmetDirectives, getSwaggerConfig } from '@hikers-book/tsed-common/swagger';
import '@tsed/ajv';
import { Configuration } from '@tsed/di';
import '@tsed/mongoose';
import '@tsed/platform-express'; // /!\ keep this import
import helmet from 'helmet';
import { join } from 'path';
import * as docs from './docs/controllers/pages/index';
import './providers/ConfigProvider';
import * as v1 from './v1/controllers/index';

@Configuration({
  // @Configuration decorator from base class is not working
  ...ConfigServiceBase.getServerDefaults(),
  mount: {
    '/v1': [...Object.values(v1)],
    '/': [...Object.values(docs)]
  },
  swagger: getSwaggerConfig(),
  views: {
    root: join(process.cwd(), '../views'),
    extensions: {
      ejs: 'ejs'
    }
  }
})
export class Server extends BaseServer {
  $beforeRoutesInit(): void {
    this.registerMiddlewares();

    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: getHelmetDirectives()
        }
      })
    );
  }
}
