import { Injectable } from '@nestjs/common';
import { createRawPaginatedResult } from 'src/core/data/helpers/pagination.helper';
import { PaginatedResult } from 'src/core/data/paginated-result';
import { PaginationOptions, SortDirection } from 'src/core/data/pagination-options';
import { PrismaService } from 'src/core/data/services/prisma.service';
import { Prisma } from 'src/generated/prisma/client';

// List view - minimal fields
export const USER_LIST_INCLUDE = {
  profile: {
    select: {
      avatar: true
    }
  }
} satisfies Prisma.UserInclude;

// Detail view - all fields and relations
export const USER_DETAIL_INCLUDE = {
  profile: true,
} satisfies Prisma.UserInclude;

// Result types

export type UserListResult = Prisma.UserGetPayload<{
  include: typeof USER_LIST_INCLUDE;
}>;

export type UserDetailResult = Prisma.UserGetPayload<{
  include: typeof USER_DETAIL_INCLUDE;
}>;

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) { }

  // Create
  async create(data: Prisma.UserCreateInput): Promise<UserDetailResult> {
    return this.prisma.client.user.create({
      data,
      include: USER_DETAIL_INCLUDE,
    });
  }

  // Read
  async findUserById(id: number): Promise<UserDetailResult | null> {
    return this.prisma.client.user.findUnique({
      where: { id },
      include: USER_DETAIL_INCLUDE,
    });
  }

  // Find user by email (for authentication)
  async findByEmail(email: string): Promise<UserDetailResult | null> {
    return this.prisma.client.user.findUnique({
      where: { email },
      include: USER_DETAIL_INCLUDE,
    });
  }
  async findMany(
    options: PaginationOptions = { limit: 10 }
  ): Promise<PaginatedResult<UserListResult>> {
    const { limit, cursorId, sort } = options;

    const findManyOptions: Prisma.UserFindManyArgs = {
      include: USER_LIST_INCLUDE,
      take: limit,
      orderBy: sort || { id: SortDirection.DESC },
    };

    if (cursorId) {
      findManyOptions.cursor = { id: cursorId };
      findManyOptions.skip = 1;
    }

    const [items, total] = await this.prisma.client.$transaction([
      this.prisma.client.user.findMany(findManyOptions),
      this.prisma.client.user.count(),
    ]);

    return createRawPaginatedResult(items, total, options, 'id');
  }


  // Update
  async update(
    id: number,
    data: Prisma.UserUpdateInput,
  ): Promise<UserDetailResult> {
    return this.prisma.client.user.update({
      where: { id },
      data,
      include: USER_DETAIL_INCLUDE,
    });
  }

  // Delete
  async delete(id: number): Promise<void> {
    await this.prisma.client.user.delete({ where: { id } });
  }

  // Get user stats
  async getUserStats() {
    const [totalUsers, activeUsers] = await Promise.all([
      this.prisma.client.user.count(),
      this.prisma.client.user.count({ where: { isActive: true } }),
    ]);

    return {
      totalUsers,
      activeUsers,
      activePercentage: (activeUsers / totalUsers) * 100,
    };
  }
}
