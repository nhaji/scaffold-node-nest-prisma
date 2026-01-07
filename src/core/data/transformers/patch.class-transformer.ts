import { Logger } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/client';
import { plainToInstance as originalPlainToInstance, ClassTransformOptions } from 'class-transformer';

/**
 * Monkey patches the class-transformer's plainToInstance function
 * to automatically convert Prisma Decimal objects to numbers
 * before class-transformer processes them.
 * 
 * This prevents "DecimalError: Invalid argument: undefined" errors.
 */
export function patchClassTransformer() {

   const logger = new Logger(patchClassTransformer.name); 

  // Store the original function
  const originalFunction = originalPlainToInstance;

  // Create our enhanced version
  function patchedPlainToInstance<T>(cls: new () => T, plain: any, options?: ClassTransformOptions): T {
    // Step 1: Transform all Decimal objects to numbers in the input data
    const transformedPlain = transformDecimalsToNumbers(plain);
    
    // Step 2: Call the original function with the transformed data
    return originalFunction(cls, transformedPlain, options);
  }

  /**
   * Recursively converts all Decimal objects to numbers
   */
  function transformDecimalsToNumbers(obj: any): any {
    // Handle null/undefined
    if (obj === null || obj === undefined) {
      return obj;
    }

    // Handle arrays - transform each item
    if (Array.isArray(obj)) {
      return obj.map(item => transformDecimalsToNumbers(item));
    }

    // Handle Prisma Decimal objects
    if (obj instanceof Decimal) {
      return obj.toNumber();
    }

    // Handle objects (but not Dates or other special objects)
    if (typeof obj === 'object' && !(obj instanceof Date) && !(obj instanceof RegExp)) {
      // Check if it's a Decimal by duck typing (has toNumber method)
      if ('toNumber' in obj && typeof obj.toNumber === 'function') {
        try {
          return obj.toNumber();
        } catch {
          // If conversion fails, continue processing as regular object
        }
      }

      // Regular object - transform each property
      const result: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          result[key] = transformDecimalsToNumbers(obj[key]);
        }
      }
      return result;
    }

    // Return primitives (strings, numbers, booleans) as-is
    return obj;
  }
  
  // Also replace it on the default export if needed
  (originalPlainToInstance as any) = patchedPlainToInstance;

  logger.log('✅ class-transformer monkey-patched to handle Prisma Decimals');
}