import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { PaginationOptions } from 'src/core/data/pagination-options';
import { HesPaginatedDto } from 'src/core/networking/dto/hes-paginated.dto';
import { CommentService } from '../services/comment.service';
import { CommentDto } from '../dto/comment.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';

/**
 * Controller for handling comment endpoints.
 * Manages HTTP requests for comment operations.
 */
@ApiTags('Comments')
@ApiBearerAuth()
@Controller('comments')
export class CommentController {
  /**
   * Creates an instance of CommentController.
   * @param commentService - The comment service
   */
  constructor(private readonly commentService: CommentService) {}

  /**
   * Creates a new comment.
   * @param createCommentDto - The DTO for creating a comment
   * @returns The created comment
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new commnt' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The comment has been successfully created.',
    type: CommentDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentDto> {
    return this.commentService.create(createCommentDto);
  }


  /**
   * Retrieves a paginated list of all comments.
   * @param paginationOptions - Pagination options
   * @returns A paginated list of all comments
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all comments' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'cursorId',
    required: false,
    type: Number,
    description: 'ID of the item after which to start fetching (for cursor-based pagination)',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sorting order (e.g., id:asc, createdAt:desc)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A paginated list of comments.',
    type: HesPaginatedDto<CommentDto>,
  })
  async findAll(
    @Query() paginationOptions: PaginationOptions,
  ): Promise<HesPaginatedDto<CommentDto>> {
    return this.commentService.findAll(paginationOptions);
  }


  /**
   * Deletes a comment by its ID.
   * @param id - The ID of the comment to delete
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a comment by ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The comment has been successfully deleted.',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Comment not found.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.commentService.remove(+id);
  }
}