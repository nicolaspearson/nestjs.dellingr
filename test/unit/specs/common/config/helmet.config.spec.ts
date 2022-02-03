import { getContentResourcePolicy } from '$/common/config/helmet.config';
import { Environment } from '$/common/enum/environment.enum';

describe('Helmet Config', () => {
  describe('getContentResourcePolicy', () => {
    afterEach(() => {
      process.env.NODE_ENV = Environment.Development;
    });

    test('should return true if invoked in a production environment', () => {
      process.env.NODE_ENV = Environment.Production;
      const result = getContentResourcePolicy();
      expect(result).toEqual(true);
    });

    test('should return the correct directive configuration if invoked in a non-production environment', () => {
      process.env.NODE_ENV = Environment.Development;
      const result = getContentResourcePolicy();
      expect(result).toMatchObject({
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      });
    });
  });
});
