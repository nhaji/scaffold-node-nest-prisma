import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateProfileDto{
  @ApiProperty({ 
     example: 'A short bio about the user', 
     required: false,
     maxLength: 500 
   })
   @IsString()
   @MaxLength(500)
   @IsOptional()
   bio?: string;
 
   @ApiProperty({ 
     example: 'https://example.com/avatar.jpg', 
     required: false 
   })
   @IsUrl()
   @IsOptional()
   avatar?: string;
}