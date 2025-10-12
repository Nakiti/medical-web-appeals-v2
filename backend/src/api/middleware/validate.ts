import type { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { ApiError } from '../../utils/ApiError.js';

/**
 * A middleware function that validates the request body, params, and query
 * against a provided Zod schema.
 * @param schema The Zod schema to validate against.
 */
export const validate = (schema: ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Validating request body:", req.body);
      // Parse and validate the request
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // If validation is successful, proceed to the controller
      next();
    } catch (error) {
      // If validation fails, pass a formatted error to the error handler
      if (error instanceof ZodError) {
        const errorMessage = error.issues.map((e) => e.message).join(', ');
        return next(new ApiError(400, errorMessage));
      }
      next(new ApiError(500, 'Internal server error during validation'));
    }
  };
