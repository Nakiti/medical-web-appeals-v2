import express, { type Express, type Request, type Response, type NextFunction} from "express"
import cors from "cors"
import dotenv from "dotenv"
import {connectDb} from "./config/database.js"
import { ApiError } from "./utils/ApiError.js"
import mainRouter  from "./api/routes/index.js"
import cookieParser from "cookie-parser"
 
// load env vars 
dotenv.config()  
  
const app: Express = express()
const PORT = process.env.PORT || 4000 

app.use(cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:3000"],
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api", mainRouter)

app.get("/", (req, res) => {
  res.json("alive")
})

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, 'Not Found'));
});

// Centralized error handling middleware.
// This catches all errors passed via `next(error)` from any controller.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    // If it's a known API error, send a structured JSON response
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } 

  // For unexpected, non-API errors, log them and send a generic 500 response.
  console.error('Unhandled Error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
});


// 4. Start Server
// ---------------

const startServer = async () => {
  try {
    // First, connect to the database using Sequelize.
    await connectDb();
    
    // Once the database connection is successful, start the Express server.
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();