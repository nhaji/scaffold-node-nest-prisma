import { Injectable } from '@nestjs/common';
import { PaginationOptions, SortDirection } from 'src/core/data/pagination-options';
import { PaginatedResult } from 'src/core/data/paginated-result';
import { createRawPaginatedResult } from 'src/core/data/helpers/pagination.helper';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/core/data/services/prisma.service';
import { USER_SELECT } from 'src/features/shared/constants/select.constants';

/**
 * Include options for list view of comments
 * Contains minimal required relations for displaying in lists
 */
export const COMMENT_LIST_INCLUDE = {
    user: {
        select: USER_SELECT
    }
} as const satisfies Prisma.CommentInclude;

/**
 * Include options for detailed view of a comment
 * Extends the list view with any additional relations needed for detailed view
 */
export const COMMENT_DETAIL_INCLUDE = {
    ...COMMENT_LIST_INCLUDE
} as const satisfies Prisma.CommentInclude;

/**
 * Type for list view of comments
 */
export type CommentListResult = Prisma.CommentGetPayload<{
    include: typeof COMMENT_LIST_INCLUDE;
}>;

/**
 * Type for detailed view of a comment
 */
export type CommentDetailResult = Prisma.CommentGetPayload<{
    include: typeof COMMENT_DETAIL_INCLUDE;
}>;

/**
 * Repository for handling database operations for Comments
 * Provides methods for CRUD operations with proper typing and pagination
 */
@Injectable()
export class CommentRepository {
    /**
     * Creates an instance of CommentRepository
     * @param prisma - The Prisma service instance
     */
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Creates a new comment in the database
     * @param data - The comment data to create
     * @returns Promise resolving to the created comment with all relations
     */
    async create(data: Prisma.CommentCreateInput): Promise<CommentDetailResult> {
        return this.prisma.client.comment.create({
            data,
            include: COMMENT_DETAIL_INCLUDE,
        });
    }

    /**
     * Finds a comment by ID with all details
     * @param id - The ID of the comment to find
     * @returns Promise resolving to the found comment or null if not found
     */
    async findById(id: number): Promise<CommentDetailResult | null> {
        return this.prisma.client.comment.findUnique({
            where: { id },
            include: COMMENT_DETAIL_INCLUDE,
        });
    }

    /**
     * Finds multiple comments with pagination and filtering
     * @param options - Pagination and sorting options
     * @param where - Optional filter conditions
     * @returns Promise resolving to paginated result of comments
     */
    async findMany(
        options: PaginationOptions = new PaginationOptions(),
        where: Prisma.CommentWhereInput = {},
    ): Promise<PaginatedResult<CommentListResult>> {
        const { limit = 10, cursorId, sort } = options;

        const findManyOptions: Prisma.CommentFindManyArgs = {
            take: limit,
            where,
            orderBy: sort || { createdAt: SortDirection.DESC },
            include: COMMENT_LIST_INCLUDE,
        };

        if (cursorId) {
            findManyOptions.cursor = { id: cursorId };
            findManyOptions.skip = 1;
        }

        const [items, total] = await this.prisma.client.$transaction([
            this.prisma.client.comment.findMany(findManyOptions),
            this.prisma.client.comment.count({ where }),
        ]);

        return createRawPaginatedResult(items, total, options, 'id');
    }

    /**
     * Updates a comment by ID
     * @param id - The ID of the comment to update
     * @param data - The data to update
     * @returns Promise resolving to the updated comment
     * @throws {Prisma.PrismaClientKnownRequestError} If the comment is not found
     */
    async update(
        id: number,
        data: Prisma.CommentUpdateInput,
    ): Promise<CommentDetailResult> {
        return this.prisma.client.comment.update({
            where: { id },
            data,
            include: COMMENT_DETAIL_INCLUDE,
        });
    }

    /**
     * Deletes a comment by ID
     * @param id - The ID of the comment to delete
     * @returns Promise resolving to the deleted comment
     * @throws {Prisma.PrismaClientKnownRequestError} If the comment is not found
     */
    async delete(id: number): Promise<CommentDetailResult> {
        return this.prisma.client.comment.delete({
            where: { id },
            include: COMMENT_DETAIL_INCLUDE,
        });
    }

    /**
     * Checks if a comment exists matching the given conditions
     * @param where - The conditions to check
     * @returns Promise resolving to true if a matching comment exists, false otherwise
     */
    async exists(where: Prisma.CommentWhereInput): Promise<boolean> {
        const count = await this.prisma.client.comment.count({ where });
        return count > 0;
    }

}