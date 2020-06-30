import { Injectable } from '@nestjs/common';
import { createClient, RedisClient } from 'redis';
import { ApiConfigService } from 'src/core';

@Injectable()
export class RedisService {
  private _client: RedisClient;

  get client(): RedisClient {
    return this._client;
  }

  constructor(private readonly apiConfigModule: ApiConfigService) {
    this._client = createClient({ url: this.apiConfigModule.redisUrl });
  }
}
