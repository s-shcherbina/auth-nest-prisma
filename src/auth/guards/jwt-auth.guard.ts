import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { isPublic } from 'src/decorators/public.decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const _isPublic = isPublic(ctx, this.reflector);
    if (_isPublic) {
      return true;
    }
    return super.canActivate(ctx);
  }
}

// import { AuthGuard } from '@nestjs/passport';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {}
