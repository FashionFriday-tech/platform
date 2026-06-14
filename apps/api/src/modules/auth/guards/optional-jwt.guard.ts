import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Optional JWT guard — allows the request through even without a valid token.
 * When a valid token is present, req.user is populated. Otherwise req.user is undefined.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleRequest<TUser = any>(_err: unknown, user: TUser): TUser {
    // Return user if valid, null if not — never throw
    return user;
  }
}
