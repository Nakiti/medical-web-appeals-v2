import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define a custom property 'user' on the Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

/**
 * Express middleware to verify a JSON Web Token (JWT) and authenticate the user.
 * If the token is valid, it attaches the user payload to the `req.user` property.
 * If the token is invalid or missing, it sends a 401 Unauthorized response.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 */
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format is "Bearer <TOKEN>"

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }

  // Ensure the JWT_SECRET is loaded from your environment variables
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET is not defined in environment variables.');
    return res.status(500).json({ message: 'Internal Server Error: Server configuration error.' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      // Common errors are TokenExpiredError or JsonWebTokenError
      return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }

    // Attach the decoded payload to the request object
    // You can now access req.user in your protected route controllers
    req.user = decoded as { id: string; email: string };

    next();
  });
};
