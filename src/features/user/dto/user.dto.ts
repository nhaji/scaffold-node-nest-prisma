import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserDto {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email address' })
  @Expose()
  email: string;

  @ApiProperty({ 
    example: 'https://example.com/avatar.jpg', 
    description: 'URL to avatar',
    required: false 
  })
  @Expose()
  avatar?: string;
}