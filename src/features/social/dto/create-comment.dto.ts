import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'The comment text content' })
  @IsString()
  @IsNotEmpty()
  text: string;
}