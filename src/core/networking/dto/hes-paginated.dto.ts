import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class HesPaginatedDto<T> {
  @ApiProperty({ isArray: true, description: 'Array of data items' }) 
  @Type(() => Object)
  @Expose()
  data: T[];

  @ApiProperty({ example: 100, description: 'Total number of items' })
  @Expose()
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  @Expose()
  page: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  @Expose()
  limit: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  @Expose()
  totalPages: number;

  @ApiProperty({ example: true, description: 'Indicates if there is a next page' })
  @Expose()
  hasNext: boolean;

  @ApiProperty({ example: false, description: 'Indicates if there is a previous page' })
  @Expose()
  hasPrev: boolean;

  @ApiProperty({
    example: 10,
    description: 'Cursor ID for the next page (for cursor-based pagination)',
    required: false,
  })
  @Expose()
  nextCursorId?: number;
}
