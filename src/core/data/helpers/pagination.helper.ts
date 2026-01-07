import { plainToInstance } from 'class-transformer';
import { PaginationOptions } from '../pagination-options';
import { PaginatedResult } from '../paginated-result';

/**
 * Calculates pagination metadata and wraps raw entities in a PaginatedResult.
 * This is intended for use in repositories.
 * @template T The type of the raw entity.
 */
export function createRawPaginatedResult<T>(
  data: T[], // Raw data from the database
  total: number,
  options: PaginationOptions,
  idFieldName: keyof T = 'id' as keyof T, // Field to use for cursor, typically 'id'
): PaginatedResult<T> {
  const { page = 1, limit = 10 } = options;

  const totalPages = Math.ceil(total / limit);
  const hasNext = data.length === limit;
  const hasPrev = page > 1;

  let nextCursorId: number | undefined;
  if (hasNext && data.length > 0) {
    const lastItem = data[data.length - 1];
    // Ensure the idFieldName exists and is a number
    if (lastItem && typeof lastItem[idFieldName] === 'number') {
      nextCursorId = lastItem[idFieldName] as number;
    }
  }

  return {
    data,
    total,
    page,
    limit,
    totalPages,
    hasNext,
    hasPrev,
    nextCursorId,
  };
}

/**
 * Maps the data within an existing PaginatedResult from one type to another (e.g., entity to DTO).
 * This is intended for use in services or mappers.
 * @template T The original type of data in the PaginatedResult (e.g., raw entity).
 * @template U The target type for the data (e.g., DTO).
 * @param rawPaginatedResult The original paginated result.
 * @param mappingFunction A function that transforms each item of type T to type U.
 * @returns A new PaginatedResult with data transformed to type U.
 */
export function mapPaginatedResultData<T, U>(
  rawPaginatedResult: PaginatedResult<T>,
  mappingFunction: (item: T) => U,
): PaginatedResult<U> {
  const mappedData = rawPaginatedResult.data.map(mappingFunction);

  return {
    ...rawPaginatedResult,
    data: mappedData,
  };
}
