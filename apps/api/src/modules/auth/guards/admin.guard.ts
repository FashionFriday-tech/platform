import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    const role = user.role;
    if (role === 'SUPER_ADMIN' || role === 'STAFF_ADMIN') {
      return true;
    }

    throw new ForbiddenException('Forbidden: Administrator privileges required');
  }
}
