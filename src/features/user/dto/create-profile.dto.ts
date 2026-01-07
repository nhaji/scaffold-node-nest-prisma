import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUrl, MaxLength } from "class-validator";

export class CreateProfileDto {
  @ApiProperty({ 
    example: 'A bio about the user', 
    required: true,
    maxLength: 500 
  })
  @IsString()
  @MaxLength(500)
  bio: string;

  @ApiProperty({ 
    example: 'https://example.com/avatar.jpg', 
    required: true 
  })
  @IsUrl()
  avatar: string;
}