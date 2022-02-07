import { ContentSecurityPolicyOptions } from 'helmet/dist/types/middlewares/content-security-policy';

import { Environment } from '$/common/enum/environment.enum';

/**
 * Creates the content security policy configuration which helmet should use.
 *
 * In development we return a relaxed set of directives to serve the swagger documentation.
 *
 * @returns The {@link ContentSecurityPolicyOptions} in development, and true in production.
 */
export function getContentResourcePolicy(
  nodeEnvironment: Environment,
): boolean | ContentSecurityPolicyOptions {
  if (nodeEnvironment !== Environment.Production) {
    return {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    };
  }
  return true;
}
