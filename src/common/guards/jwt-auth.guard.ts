import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { UnauthorizedError } from '$/common/error';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const authorizationHeader = req.get('authorization');
    if (!authorizationHeader) {
      throw new UnauthorizedError('The JWT is missing from the request.');
    }
    const jwt = authorizationHeader.replace(/^bearer /gi, '');
    const jwtPayload = verifyJwt(jwt);
    // Set the user uuid on the request object, which can then be extracted and used.
    req.userUuid = jwtPayload.uuid;
    // Return true to allow the request to continue,
    return true;
  }
}

/**
 * Verifies that the provided JWT is valid, and returns the decoded payload.
 *
 * @param jwt The JWT that extracted from the request object.
 * @returns The decoded {@link Api.JwtPayload}
 */
export function verifyJwt(jwt: string): Api.JwtPayload {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return verify(jwt, process.env.JWT_SECRET!, {
      ignoreExpiration: false,
    }) as Api.JwtPayload;
  } catch {
    throw new UnauthorizedError('Invalid JWT provided.');
  }
}
