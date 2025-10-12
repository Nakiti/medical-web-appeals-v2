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

export interface UserPayload {
  id: string;
  // You can add other properties like email, role, etc.
}

// Extend the default Express Request type
export interface RequestWithUser extends Request {
  user?: UserPayload | null; // The 'user' property is optional and can be null
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
  const token = req.cookies.auth_token;

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

export const decodeUserMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    // --- This is the key change ---
    const token = req.cookies.auth_token; 
    const jwtSecret = process.env.JWT_SECRET;

    if (token && jwtSecret) {
      const decoded = jwt.verify(token, jwtSecret) as { id: string; email: string };
      req.user = decoded;
    } else {
      req.user = null;
    }
  } catch (error) {
    // If jwt.verify fails, treat as unauthenticated
    req.user = null;
  }
  
  // Always pass control to the next middleware or controller
  next(); 
};



export const requireAuthMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  
  // If we get here, the user is authenticated, so we can proceed
  next();
};