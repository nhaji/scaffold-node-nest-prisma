import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    HttpException,
    HttpStatus,
    Logger,
  } from '@nestjs/common';
  import { catchError, map, Observable, throwError } from 'rxjs';
  import { HesResponseDto } from '../dto/hes-response.dto';
  import { HesErrorDto } from '../dto/hes-error.dto';
  import { FastifyRequest } from 'fastify';
  import { HesHttpContextService } from '../services/hes-http-context.service';
import { PrismaClientKnownRequestError } from 'src/generated/prisma/internal/prismaNamespace';
  
  // Define an interface for the structured error output from handler methods
  interface ErrorDetails {
    status: HttpStatus;
    message: string;
    errorCode: string;
    errorDetails: any;
  }
  
  @Injectable()
  export class HesHttpInterceptor<T> implements NestInterceptor<T, HesResponseDto<T>> {
    private readonly logger = new Logger(HesHttpInterceptor.name);
  
    constructor(private readonly httpContextService: HesHttpContextService) {} 
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<HesResponseDto<T>> {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest<FastifyRequest>();
  
      return next.handle().pipe(
        map(data => {
          const successResponse: HesResponseDto<T> = {
            requestId: this.httpContextService.getRequestId() || 'unknown',
            success: true,
            message: data?.message || 'Operation completed successfully.',
            data: data instanceof Object && data!,
            error: undefined,
            timestamp: new Date().toISOString(),
          };
          return successResponse;
        }),
        catchError(error => {
          const timestamp = new Date().toISOString();
          let status = HttpStatus.INTERNAL_SERVER_ERROR;
          let message = 'An unexpected error occurred';
          let errorCode = 'UNEXPECTED_ERROR';
          let errorDetails: any = null;
  
          // Use the new helper methods
          let handledError: ErrorDetails;
          if (error instanceof PrismaClientKnownRequestError) {
            handledError = this.handlePrismaError(error);
          } else if (error instanceof HttpException) {
            handledError = this.handleHttpError(error);
          } else if (error instanceof Error) {
            this.logger.error(`Unhandled Error: ${error.message}`, error.stack);
            handledError = {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              message: error.message,
              errorCode: 'SERVER_ERROR',
              errorDetails: null,
            };
          } else {
            this.logger.error(`Unknown error type: ${error}`, error);
            handledError = {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              message: 'An unknown error occurred',
              errorCode: 'UNKNOWN_ERROR',
              errorDetails: null,
            };
          }
  
          // Apply details from the handled error
          status = handledError.status;
          message = handledError.message;
          errorCode = handledError.errorCode;
          errorDetails = handledError.errorDetails;
  
          const hesError: HesErrorDto = {
            message: message,
            code: errorCode,
            statusCode: status,
            details: errorDetails,
            timestamp: timestamp,
          };
  
          const errorHesResponse: HesResponseDto<T> = {
            requestId: this.httpContextService.getRequestId() || 'unknown', 
            success: false,
            message: message,
            data: undefined,
            error: hesError,
            timestamp: timestamp,
          };
  
          return throwError(() => new HttpException(
            errorHesResponse,
            status,
          ));
        }),
      );
    }

    // Helper method to handle PrismaClientKnownRequestError
    private handlePrismaError(error: PrismaClientKnownRequestError): ErrorDetails {
        this.logger.error(`Prisma Error [${error.code}]: ${error.message}`, error.stack);
        let status = HttpStatus.BAD_REQUEST;
        let message = 'A database operation failed.';
        let errorCode = `PRISMA_ERROR_${error.code}`;
        let errorDetails: any = null;
    
        switch (error.code) {
          case 'P2002': // Unique constraint violation
            status = HttpStatus.CONFLICT;
            message = `Unique constraint failed on the field: ${(error.meta as any)?.target || 'unknown'}`;
            errorDetails = (error.meta as any)?.target;
            errorCode = 'PRISMA_UNIQUE_CONSTRAINT_FAILED';
            break;
          case 'P2025': // Record to update/delete not found
            status = HttpStatus.NOT_FOUND;
            message = `Record not found: ${(error.meta as any)?.cause || 'requested record'}`;
            errorDetails = (error.meta as any)?.cause;
            errorCode = 'PRISMA_RECORD_NOT_FOUND';
            break;
          case 'P2003': // Foreign key constraint violation
            status = HttpStatus.BAD_REQUEST;
            message = `Foreign key constraint failed on field: ${(error.meta as any)?.field_name || 'unknown'}`;
            errorDetails = (error.meta as any)?.field_name;
            errorCode = 'PRISMA_FOREIGN_KEY_FAILED';
            break;
          case 'P2000': // Value too large for column
            status = HttpStatus.BAD_REQUEST;
            message = `Input value is too large for a field.`;
            errorCode = 'PRISMA_VALUE_TOO_LARGE';
            break;
          // Add more specific Prisma error codes as needed
          default:
            // Generic database error, often best to keep internal details minimal for clients
            message = `Database operation failed: ${error.message.split('\n').slice(-1)[0] || 'An unknown database error occurred.'}`;
            status = HttpStatus.INTERNAL_SERVER_ERROR; // Default to 500 for unhandled Prisma errors
            break;
        }
        return { status, message, errorCode, errorDetails };
      }
    
      // Helper method to handle HttpException
      private handleHttpError(error: HttpException): ErrorDetails {
        const status = error.getStatus();
        const errorResponse = error.getResponse();
        let message = 'An HTTP exception occurred';
        let errorCode = 'HTTP_EXCEPTION';
        let errorDetails: any = null;
    
        if (typeof errorResponse === 'object' && errorResponse !== null && 'message' in errorResponse) {
          if (Array.isArray(errorResponse.message)) {
            message = errorResponse.message.join(', ');
            errorCode = 'VALIDATION_FAILED';
            errorDetails = errorResponse.message;
          } else if (typeof errorResponse.message === 'string') {
            message = errorResponse.message;
            errorCode = (errorResponse as any).code || 'HTTP_EXCEPTION';
            errorDetails = (errorResponse as any).error;
          }
        } else if (typeof errorResponse === 'string') {
          message = errorResponse;
          errorCode = 'HTTP_EXCEPTION';
        }
        return { status, message, errorCode, errorDetails };
      }
    
  }