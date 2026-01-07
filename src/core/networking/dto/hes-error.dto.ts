import { ApiProperty } from '@nestjs/swagger';

export class HesErrorDto {
  @ApiProperty({
    description: 'A brief, human-readable error message',
    example: 'Validation failed',
  })
  message: string;

  @ApiProperty({
    description:
      'A machine-readable error code, useful for specific client-side handling',
    example: 'VALIDATION_FAILED',
  })
  code: string;

  @ApiProperty({
    description: 'The HTTP status code associated with the error',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description:
      'Detailed information about the error (e.g., validation errors for specific fields)',
    required: false,
    example: { fields: { email: 'Invalid format' } },
  })
  details?: any; // Can be a string, object, or array for more complex error details

  @ApiProperty({
    description: 'Timestamp when the error occurred',
    example: '2025-12-02T03:00:00.000Z',
  })
  timestamp: string;
}
