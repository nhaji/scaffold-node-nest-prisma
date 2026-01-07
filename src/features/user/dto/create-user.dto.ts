import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { UserRole } from 'src/generated/prisma/enums';
import { CreateProfileDto } from './create-profile.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', required: true, minLength: 2 })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ 
    example: 'SecurePassword123!', 
    required: true, 
    minLength: 8 
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ 
    enum: UserRole, 
    example: UserRole.USER, 
    required: true 
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ type: () => CreateProfileDto, required: false })
  @Type(() => CreateProfileDto)
  @ValidateNested()
  @IsOptional()
  profile?: CreateProfileDto;
}