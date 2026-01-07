import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaginatedResult } from 'src/core/data/paginated-result';
import { mapPaginatedResultData } from 'src/core/data/helpers/pagination.helper';
import { CommentDto } from '../dto/comment.dto';
import { CommentListResult, CommentDetailResult } from '../repositories/comment.repository';
import { CommentNestedResult } from 'src/features/shared/constants/select.constants';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Prisma } from 'src/generated/prisma/client';

/**
 * Mapper service for transforming between Comment domain objects and DTOs.
 * Handles conversion between Prisma models and API response formats.
 */
@Injectable()
export class CommentMapper {
  /**
   * Transforms a CommentListResult to a CommentDto.
   * @param commentEntity - The comment entity from the repository
   * @returns A base comment DTO with flattened user information
   */
  toCommentDto(commentEntity: CommentListResult): CommentDto {
    return plainToInstance(CommentDto, {
      ...commentEntity,
      userName: commentEntity.user?.name,
      userAvatar: commentEntity.user?.profile?.avatar,
    },);
  }

  /**
* Transforms a single Comment domain object to CommentDto.
* 
* Converts Prisma Comment model to minimal DTO format with only essential fields.
* Optimized for performance when only basic comment information is needed.
* 
* @param comment - The Comment domain object from Prisma with minimal select
* @returns The transformed CommentDto with only essential fields
*/
  toCommentNestedDto(comment: CommentNestedResult): CommentDto {
    return plainToInstance(CommentDto,
      {
        ...comment,
        userId: comment.user?.id,
        userName: comment.user?.name,
        userAvatar: comment.user?.profile?.avatar,
      }
      , {
        excludeExtraneousValues: true
      });
  }

  /**
   * Transforms a paginated result of comments to a paginated result of CommentDtos.
   * @param paginatedResult - The paginated result from the repository
   * @returns A paginated result of CommentDtos
   */
  toPaginatedCommentDto(
    paginatedResult: PaginatedResult<CommentListResult>,
  ): PaginatedResult<CommentDto> {
    return mapPaginatedResultData(paginatedResult, (commentEntity) =>
      this.toCommentDto(commentEntity as CommentDetailResult),
    );
  }

    /**
   * Transforms a CreateCommentDto to a Prisma.CommentCreateInput.
   * @param createCommentDto - The DTO for creating a comment
   * @param userId - The ID of the user creating the comment
   * @returns A Prisma input object for creating a comment
   */
  toCreateCommentInput(
    createCommentDto: CreateCommentDto,
    userId: number,
  ): Prisma.CommentCreateInput {
    return {
      text: createCommentDto.text ?? '',
      user: { connect: { id: userId } },
    };
  }

}
