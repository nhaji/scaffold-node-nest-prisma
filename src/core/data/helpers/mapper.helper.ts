/**
 * Shared mapper helper functions for consistent data transformation across the application.
 */

/**
 * Helper method for handling flexible nested object relations.
 * Separates items with IDs (for connecting) from items without IDs (for creating).
 * 
 * @param items - Array of items that may or may not have IDs
 * @param mapper - Function to transform items without IDs for creation
 * @returns Object with set and create arrays for Prisma operations
 */
export function handleCreateConnectNestedRelations<T extends { id?: number }>(
    items: T[],
    mapper: (item: T) => any
): { connect: { id: number }[]; create: any[];} {
    const withId = items.filter(item => item.id);
    const withoutId = items.filter(item => !item.id);

    return {
        connect: withId.map(item => ({ id: item.id! })),
        create: withoutId.map(item => mapper(item))
    };
}

/**
 * Helper method for handling flexible nested object relations.
 * Item with IDs (for connecting) from item without IDs (for creating).
 * 
 * @param item - Item that may or may not have IDs
 * @param mapper - Function to transform item without ID for creation
 * @returns Object with set and create arrays for Prisma operations
 */
export function handleCreateConnectNestedRelation<T extends { id?: number }>(
    item: T,
    mapper: (item: T) => any
): { connect?: { id: number }; create?: any;} {

    if (item.id) {
        return { connect: { id: item.id } };
    } else {
        return { create: mapper(item) };
    }
}

/**
 * Helper method for handling flexible nested object relations.
 * Separates items with IDs (for connecting) from items without IDs (for creating) Inexisting Disconnect.
 * 
 * @param items - Array of items that may or may not have IDs
 * @param mapper - Function to transform items without IDs for creation
 * @returns Object with set and create arrays for Prisma operations
 */
export function handleCreateConnectDisconnetNestedRelations<T extends { id?: number }>(
    items: T[],
    mapper: (item: T) => any
): { set: { id: number }[]; create: any[];} {
    const withId = items.filter(item => item.id);
    const withoutId = items.filter(item => !item.id);

    return {
        set: withId.map(item => ({ id: item.id! })),
        create: withoutId.map(item => mapper(item))
    };
}

/**
 * Helper method for handling flexible nested object relations.
 * Separates items without IDs (for creating).
 * 
 * @param items - Array of items that may or may not have IDs
 * @param mapper - Function to transform items without IDs for creation
 * @returns Object with create for Prisma operations
 */
export function handleCreateNestedRelations<T extends { id?: number }>(
    items: T[],
    mapper: (item: T) => any
): { create: any[];} {
    const withoutId = items.filter(item => !item.id);

    return {
        create: withoutId.map(item => mapper(item)),
    };
}

/**
 * Helper method for handling flexible nested object relations.
 * Separates items with IDs (for updating) from items without IDs (for creating).
 * 
 * @param items - Array of items that may or may not have IDs
 * @param mapper - Function to transform items without IDs for creation and with ID for update
 * @returns Object with set, create and update arrays for Prisma operations
 */
export function handleCreateUpdateNestedRelations<T extends { id?: number }>(
    items: T[],
    mapper: (item: T) => any
): { create: any[]; update: any[]} {
    const withId = items.filter(item => item.id);
    const withoutId = items.filter(item => !item.id);

    return {
        create: withoutId.map(item => mapper(item)),
        update: withId.map(item => ({ where: { id: item.id! }, data: mapper(item) }))
    };
}