import { createAsyncDecorator } from './create-async-decorator';

export const ToObject = createAsyncDecorator(result => result.toObject());
