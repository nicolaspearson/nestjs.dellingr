import { getContentResourcePolicy } from '$/common/config/helmet.config';
import { Environment } from '$/common/enum/environment.enum';

describe('Helmet Config', () => {
  describe('getContentResourcePolicy', () => {
    test('should return true if invoked in a production environment', () => {
      const result = getContentResourcePolicy(Environment.Production);
      expect(result).toEqual(true);
    });

    test('should return the correct directive configuration if invoked in a non-production environment', () => {
      const result = getContentResourcePolicy(Environment.Development);
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
