
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class InternalApiGuard implements CanActivate {
  constructor(private cfg: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest();
    return request.headers.authorization === this.cfg.getOrThrow<string>("INTERNAL_API_KEY");
  }
}
