import { Injectable, Scope } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { HesHttpContext } from '../hes-http-context';

@Injectable({ scope: Scope.DEFAULT })
export class HesHttpContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<HesHttpContext>();

  run(context: HesHttpContext, callback: () => any) {
    return this.asyncLocalStorage.run(context, callback);
  }

  getContext(): HesHttpContext | undefined {
    return this.asyncLocalStorage.getStore();
  }

  getRequestId(): string | undefined {
    return this.getContext()?.requestId;
  }
  
  getUserId(): number | undefined {
    return this.getContext()?.userId;
  }

  // Helper methods for convenience
  setContext(context: HesHttpContext) {
    // Note: This doesn't actually set context, but runs a new context
    // For setting properties on existing context, use getContext() and modify
    return this.asyncLocalStorage.run(context, () => {});
  }

  getElapsedTime(): number {
    const context = this.getContext();
    return context ? Date.now() - context.startTime : 0;
  }
}