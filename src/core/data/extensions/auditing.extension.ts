import { Prisma } from 'src/generated/prisma/client';
import { HesHttpContextService } from '../../networking/services/hes-http-context.service'; 

/**
 * Defines a Prisma Client extension for automatically populating 'createdById'
 * and 'updatedById' fields based on the current user's context.
 *
 * This extension should be applied to a PrismaClient instance.
 * It requires a HesHttpContextService instance to retrieve the userId.
 */
export const auditingExtension = (httpContextService: HesHttpContextService) => Prisma.defineExtension({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const userId = httpContextService.getUserId(); // Get userId from AsyncLocalStorage

        // Apply audit fields only for 'create' and 'update' operations,
        // and only if a userId is available from the context.
        if (userId && (operation === 'create' || operation === 'update')) {
          // Robust type guard: Ensure args.data exists and is a modifiable object (not null/array).
          if (
            args &&
            typeof args === 'object' &&
            'data' in args &&
            args.data !== null &&
            typeof args.data === 'object' &&
            !Array.isArray(args.data)
          ) {
            // Assert args.data to a mutable plain object type for safe assignment.
            const data = args.data as Record<string, any>;

            if (operation === 'create' && !data.createdBy) {
                    data.createdBy = { connect: { id: userId } };                 
            }
            if (operation === 'update' && !data.updatedBy) {
                    data.updatedBy = { connect: { id: userId } };       
            }
          }
        }
        return query(args); // Continue with the original query execution
      },
    },
  },
});