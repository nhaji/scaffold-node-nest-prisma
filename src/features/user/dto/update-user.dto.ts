import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { UpdateProfileDto } from './update-profile.dto';
import { UserRole } from 'src/generated/prisma/enums';

export class UpdateUserDto {
    @ApiProperty({
        example: 'John Doe',
        required: false,
        minLength: 2
    })
    @IsString()
    @MinLength(2)
    @IsOptional()
    name?: string;

    @ApiProperty({
        example: 'NewPassword123!',
        required: false,
        minLength: 8
    })
    @IsString()
    @MinLength(8)
    @IsOptional()
    password?: string;

    @ApiProperty({
        enum: UserRole,
        example: UserRole.USER,
        required: false
    })
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;

    @ApiProperty({
        type: () => UpdateProfileDto,
        required: false,
        nullable: true
    })
    @Type(() => UpdateProfileDto)
    @ValidateNested()
    @IsOptional()
    profile?: UpdateProfileDto | null;
}