import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class ProfileDto {
  @ApiProperty({ example: 1, description: 'Profile ID' })
  @Expose()
  id: number;

  @ApiProperty({ 
    example: 'A short bio about the user', 
    required: false,
    maxLength: 500,
    description: 'User biography (max 500 characters)' 
  })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  @Expose()
  bio?: string;

  @ApiProperty({ 
    example: 'https://example.com/avatar.jpg', 
    required: false,
    description: 'URL to profile picture' 
  })
  @IsUrl()
  @IsOptional()
  @Expose()
  avatar?: string;
}