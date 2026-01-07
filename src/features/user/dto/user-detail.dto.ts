import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProfileDto } from './profile.dto';

export class UserDetailDto {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email address' })
  @Expose()
  email: string;

  @ApiProperty({ example: true, description: 'Account active status' })
  @Expose()
  isActive: boolean;

  @ApiProperty({ 
    enum: ['USER', 'ADMIN'], 
    example: 'USER', 
    description: 'User role' 
  })
  @Expose()
  role: string;

  @ApiProperty({ 
    type: () => ProfileDto, 
    description: 'User profile details',
    required: false 
  })
  @Expose()
  @Type(() => ProfileDto)
  profile?: ProfileDto;
}