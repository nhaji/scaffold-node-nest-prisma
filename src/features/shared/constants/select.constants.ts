import { Prisma } from "src/generated/prisma/client";

/**
 * Fields to include when selecting user data in nested query
 */
export const USER_SELECT = {
  id: true,
  name: true,
  profile: {
    select: {
      avatar: true,
    }
  }
} satisfies Prisma.UserSelect;


/**
 * Type representing a user with standard selected fields
 * Used for queries that use USER_SELECT with the select option
 */
export type UserNestedResult = Prisma.UserGetPayload<{
  select: typeof USER_SELECT;
}>;

export const COMMENT_SELECT = {
  id: true,
  createdAt: true,
  text: true,
  user: {
    select: USER_SELECT
  },
} satisfies Prisma.CommentSelect;

export type CommentNestedResult = Prisma.CommentGetPayload<{
  select: typeof COMMENT_SELECT;
}>;