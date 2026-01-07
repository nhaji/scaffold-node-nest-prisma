import { Module, forwardRef } from '@nestjs/common';
import { CommentMapper } from './mappers/comment.mapper';
import { CommentRepository } from './repositories/comment.repository';
import { CommentService } from './services/comment.service';
import { CommentController } from './controllers/comment.controller';

/**
 * Module for comment feature.
 * Provides comment-related functionality including CRUD operations and pagination.
 */
@Module({
  imports: [],
  controllers: [CommentController],
  providers: [CommentRepository, CommentService, CommentMapper],
  exports: [CommentService, CommentMapper, CommentRepository],
})
export class SocialModule { }