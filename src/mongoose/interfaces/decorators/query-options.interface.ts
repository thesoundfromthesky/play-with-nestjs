import { AsyncDecoratorOptions } from './async-decorator-options.interface';
import { DecoratorOptions } from './decorator-option.interface';

export interface QueryOptions extends AsyncDecoratorOptions, DecoratorOptions {}
