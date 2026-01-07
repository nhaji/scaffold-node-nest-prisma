import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsString, IsDate } from 'class-validator';

export class CommentDto {
  @ApiProperty() @Expose() @IsInt() id: number;
  @ApiProperty() @Expose() @IsString() text: string;
  @ApiProperty() @Expose() @IsInt() userId: number;
  @ApiProperty() @Expose() @IsString() userName: string;
  @ApiProperty() @Expose() @IsString() userAvatar: string;
  @ApiProperty() @Expose() @IsDate() createdAt: Date;
}