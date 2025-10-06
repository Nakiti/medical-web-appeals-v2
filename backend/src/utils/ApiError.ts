/**
 * Custom Error class for handling API-specific errors.
 * This allows us to create errors with a specific HTTP status code,
 * which can then be used by our centralized error handler to send a
 * consistent, structured response to the client.
 */
class ApiError extends Error {
    public statusCode: number;
    public success: boolean;

    /**
     * @param statusCode The HTTP status code for the error (e.g., 400, 404, 500).
     * @param message A clear, user-friendly error message.
     * @param stack Optional stack trace. If not provided, it will be captured.
     */
    constructor(statusCode: number, message: string, stack = '') {
        // Call the parent constructor (Error) with the message.
        super(message);

        // Set the HTTP status code for this specific error instance.
        this.statusCode = statusCode;

        // We can add custom properties. A 'success' flag is common in API responses.
        this.success = false;

        // Capture the stack trace if it wasn't provided.
        if (stack) {
        this.stack = stack;
        } else {
        Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
