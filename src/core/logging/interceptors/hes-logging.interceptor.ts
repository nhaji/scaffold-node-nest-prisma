import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FastifyRequest } from 'fastify';
import { HesHttpContextService } from 'src/core/networking/services/hes-http-context.service';

@Injectable()
export class HesLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HesLoggingInterceptor.name);

  constructor(private readonly httpContextService: HesHttpContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const response = ctx.getResponse();

    const { method, url } = request;
    const requestId = this.httpContextService.getRequestId() || 'unknown';

    this.logger.log(
      `${requestId} Incoming Request: ${method} ${url}`,
      context.getClass().name,
    );

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        this.logger.log(
          `${requestId} Outgoing Response: ${method} ${url} - ${response.statusCode} - ${responseTime}ms`,
          context.getClass().name,
        );
      }),
    );
  }
}
