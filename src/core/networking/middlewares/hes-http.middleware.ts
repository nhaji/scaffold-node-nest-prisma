import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { HesHttpContextService } from '../services/hes-http-context.service';
import { HesHttpContext } from '../hes-http-context';

@Injectable()
export class HesHttpMiddleware implements NestMiddleware {
  constructor(private readonly contextService: HesHttpContextService) {}

  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const requestId = req.headers['x-request-id'] as string || uuidv4();

    // Attempt to get userId from header
    const userIdHeader = req.headers['x-user-id'];
    let userId: number | undefined;

    if (userIdHeader) {
      const parsedUserId = parseInt(userIdHeader as string, 10);
      if (!isNaN(parsedUserId)) {
        userId = parsedUserId;
      }
    }
    //TODO remove when integration security lyer
    else{
      userId = 3;
    }

    // Provide a default userId (e.g., 1) if not provided or invalid for testing
    // TODO: In production, this should be handled by an authentication layer.
    /* if (userId === undefined) {
      userId = 1; // Default ID for testing purposes
    } */

    
    const context: HesHttpContext = {
      requestId,
      startTime: Date.now(),
      method: req.method,
      url: req.url,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      userId: userId,
      tenantId: req.headers['x-tenant-id'] as string,
    };
    
    // Run the request in the async context
    this.contextService.run(context, () => {
      next();
    });
  }
}