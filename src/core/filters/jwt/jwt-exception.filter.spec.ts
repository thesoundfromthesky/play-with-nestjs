import { JwtExceptionFilter } from './jwt-exception.filter';

describe('JwtExceptionFilter', () => {
  it('should be defined', () => {
    expect(new JwtExceptionFilter()).toBeDefined();
  });
});
