import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiConfigService } from './core';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as RateLimit from 'express-rate-limit';
import * as RedisStore from 'rate-limit-redis';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create(AppModule, { cors: true });
  // app.setGlobalPrefix('api');
  const apiConfigService = app.get<ApiConfigService>(ApiConfigService);
  const port = apiConfigService.port;
  const redisUrl = apiConfigService.redisUrl;
  // app.use(cookieParser());
  // app.use(helmet());

  // Single Page Application (SPA)
  // Many SPA frameworks like Angular have CSRF support built in automatically.
  // Typically they will reflect the value from a specific cookie, like XSRF-TOKEN (which is the case for Angular).
  // To take advantage of this, set the value from req.csrfToken() in the cookie used by the SPA framework.
  // This is only necessary to do on the route that renders the page
  // (where res.render or res.sendFile is called in Express, for example).

  // The following is an example for Express of a typical SPA response:
  // app.all('*', function (req, res) {
  //   res.cookie('XSRF-TOKEN', req.csrfToken(),  { httpOnly: true })
  //   res.render('index')
  // })
  // app.use(csurf({ cookie: true }));

  // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // see https://expressjs.com/en/guide/behind-proxies.html
  // app.set('trust proxy', 1);
  // app.use(
  //   new (RateLimit as any)({
  //     store: new (RedisStore as any)({
  //       expiry: 60 * 15,
  //       redisURL: redisUrl,
  //     } as RedisStore.Options),
  //     max: 100, // limit each IP to 100 requests per windowMs
  //     //, delayMs: 0 // disable delaying - full speed until the max limit is reached
  //   } as RateLimit.Options),
  // );

  await app.listen(port);
}
bootstrap();
