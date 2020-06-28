import { createAsyncDecorator } from './create-async-decorator';

export const Save = createAsyncDecorator(result => result.save());
