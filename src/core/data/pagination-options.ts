import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { IsEnumObject } from './constraints/is-enum.constraint';
import { JsonParseTransform } from './helpers/json-parse.transform.helper';
import { validateIfIsDefinedAndObject } from './helpers/validate-if.helper';

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationOptions {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number) // Ensure transformation from string to number
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number) // Ensure transformation from string to number
  limit?: number;

  @IsOptional()
  @IsString() // Validate that it's a string initially
  @Transform(JsonParseTransform) 
  @ValidateIf(validateIfIsDefinedAndObject('sort'))// Only validate if sort is provided and is an object (after transform)
  @IsEnumObject(SortDirection, {
    message: `Sort parameter must be a JSON object with values "${SortDirection.ASC}" or "${SortDirection.DESC}" (e.g., {"id": "asc"})`,
  })
  sort?: Record<string, SortDirection>;

  @IsOptional()
  @IsString()
  @Transform(JsonParseTransform) 
  @ValidateIf(validateIfIsDefinedAndObject('projection'))
  projection?: Record<string, 0 | 1>; // Assuming projection values are 0 or 1 for include/exclude

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number) // Ensure transformation from string to number
  cursorId?: number;
}
