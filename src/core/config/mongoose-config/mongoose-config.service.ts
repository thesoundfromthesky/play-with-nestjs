import { Injectable } from '@nestjs/common';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
import { ApiConfigService } from '../api-config.service';
import * as virtuals from 'mongoose-lean-virtuals';
import * as getters from 'mongoose-lean-getters';
import * as defaults from 'mongoose-lean-defaults';
import { Mongoose } from 'mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private readonly apiConfigService: ApiConfigService) {}
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.apiConfigService.mongoDbHost,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
      // ,autoCreate: true
      // ,autoIndex:false
      connectionFactory: (connection: Mongoose): Mongoose => {
        // connection.plugin(require('mongoose-lean-virtuals'));
        // connection.plugin(require('mongoose-lean-getters'));
        // connection.plugin(require('mongoose-lean-defaults'));
        connection.plugin(virtuals);
        connection.plugin(getters);
        connection.plugin(defaults);

        return connection;
      },
    };
  }
}
