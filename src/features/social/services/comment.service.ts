import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CommentRepository } from '../repositories/comment.repository';
import { PaginationOptions } from 'src/core/data/pagination-options';
import { PaginatedResult } from 'src/core/data/paginated-result';
import { HesHttpContextService } from 'src/core/networking/services/hes-http-context.service';
import { CommentMapper } from '../mappers/comment.mapper';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentDto } from '../dto/comment.dto';

/**
 * Service for handling comment business logic.
 * Manages CRUD operations and authorization for comments.
 */
@Injectable()
export class CommentService {
  /**
   * Creates an instance of CommentService.
   * @param commentRepository - The comment repository
   * @param httpContextService - The HTTP context service for user information
   * @param commentMapper - The comment mapper for DTO transformations
   */
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly httpContextService: HesHttpContextService,
    private readonly commentMapper: CommentMapper,
  ) {}

  /**
   * Creates a new comment.
   * @param createCommentDto - The DTO for creating a comment
   * @returns The created comment as a CommentDto
   * @throws UnauthorizedException if user is not authenticated
   */
  async create(
    createCommentDto: CreateCommentDto,
  ): Promise<CommentDto> {
    const currentUserId = this.httpContextService.getUserId();
    if (!currentUserId) {
      throw new UnauthorizedException('User not authenticated.');
    }
    const commentData = this.commentMapper.toCreateCommentInput(
      createCommentDto,
      currentUserId,
    );
    const createdComment = await this.commentRepository.create(commentData);
    return this.commentMapper.toCommentDto(createdComment);
  }

  /**
   * Retrieves a paginated list of comments.
   * @param options - Pagination options
   * @returns A paginated result of comments
   */
  async findAll(
    options: PaginationOptions,
  ): Promise<PaginatedResult<CommentDto>> {
    const rawPaginatedComments = await this.commentRepository.findMany(
      options,
    );
    return this.commentMapper.toPaginatedCommentDto(rawPaginatedComments);
  }

  /**
   * Deletes a comment by its ID.
   * @param id - The ID of the comment to delete
   * @throws NotFoundException if the comment does not exist
   * @throws UnauthorizedException if user is not the comment author
   */
  async remove(id: number): Promise<void> {
    const existingComment = await this.commentRepository.findById(id);
    if (!existingComment) {
      throw new NotFoundException(`Comment with ID ${id} not found.`);
    }
    const currentUserId = this.httpContextService.getUserId();
    if (!currentUserId || currentUserId !== existingComment.userId) {
      throw new UnauthorizedException(
        'User is not authorized to delete this comment.',
      );
    }
    await this.commentRepository.delete(id);
  }
}