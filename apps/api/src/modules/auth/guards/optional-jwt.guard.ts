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

  handleRequest<TUser>(_err: unknown, user: TUser): TUser {
    // Return user if valid, null if not — never throw
    return user;
  }
}
