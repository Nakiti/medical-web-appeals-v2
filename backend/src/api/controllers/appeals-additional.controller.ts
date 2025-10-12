import { type Request, type Response } from 'express';
import { parseDenialLetter, generateAppealLetterText, saveAppeal, generatePDFForAppeal } from '../services/appeals.service.js';
import { generateLetterSchema, createAppealSchema, type GenerateLetterInput, type CreateAppealInput, type UuidParamInput } from '../schemas/appeals.schemas.js';
import { azureBlobService } from '../services/azure.service.js';

/**
 * Handles the logic for parsing a denial letter using Azure Document Intelligence.
 * This endpoint is protected and requires authentication.
 *
 * @param req - The Express request object with user information and uploaded file.
 * @param res - The Express response object used to send back the result.
 */
export async function parseLetterController(
  req: Request,
  res: Response
) {
  try {
    // Get the userId from the authenticated user
    const userId = req.user?.id;

    // if (!userId) {
    //   return res.status(401).json({ message: 'Unauthorized: User information not found' });
    // }

    // Check if file was uploaded
    if (!req.file) {
      console.log("no file")
      return res.status(400).json({ message: 'No file uploaded. Please upload a denial letter.' });
    }

    // Call the service to parse the denial letter
    const parsedData = await parseDenialLetter(userId, req.file);
    console.log("parsed data ", parsedData)

    // Send back the parsed data
    return res.status(200).json({
      message: 'Denial letter parsed successfully',
      parsedData
    });
  } catch (error: any) {
    console.error('Error in parseLetterController:', error);
    
    return res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
}

/**
 * Handles the logic for generating an appeal letter using OpenAI.
 * This endpoint is protected and requires authentication.
 *
 * @param req - The Express request object with user information and validated data.
 * @param res - The Express response object used to send back the result.
 */
export async function generateLetterController(
  req: Request<UuidParamInput, {}, GenerateLetterInput>,
  res: Response
) {
  try {
    // Get the userId from the authenticated user
    const userId = req.user?.id;

    // if (!userId) {
    //   return res.status(401).json({ message: 'Unauthorized: User information not found' });
    // }

    // Validate the request body
    // const validatedData = generateLetterSchema.parse(req.body);

    // Call the service to generate the appeal letter
    console.log("user id ", userId)
    console.log("req.body ", req.body)
    console.log("req.params.appealId ", req.params.appealId)
    const generatedText = await generateAppealLetterText(req.body, req.params.appealId); 

    console.log("generated text ", generatedText)
    // Send back the generated text
    return res.status(200).json({
      message: 'Appeal letter generated successfully',
      generatedText
    });
  } catch (error: any) {
    console.error('Error in generateLetterController:', error);
    
    // Handle validation errors
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Invalid request data',
        errors: error.errors
      });
    }
    
    return res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
}

export async function generatePDFController(
  req: Request<UuidParamInput, {}, { letterText: string }>, // Expect 'letterText' in the request body
  res: Response
) {
  try {
    const { appealId } = req.params;
    const { letterText } = req.body;

    // 1. Basic validation: Ensure the final letter text was provided
    if (!letterText) {
      return res.status(400).json({ message: 'Letter text is required.' });  
    }

    // 2. Call the service to perform the core logic
    const fileName = await generatePDFForAppeal(appealId, letterText);

    if (!fileName) {
      // This case handles if the appeal wasn't found in the service
      return res.status(404).json({ message: 'Appeal not found.' });
    }

    const sasUrl = await azureBlobService.generateSasUrl(fileName);

    // 3. Send a success response with the URL of the generated PDF
    res.status(200).json({ sasUrl });

  } catch (error) {
    console.error('Error in generatePDFController:', error);
    res.status(500).json({ message: 'Failed to generate PDF.' });
  }
}

/**
 * Handles the logic for saving a complete appeal with generated PDF.
 * This endpoint is protected and requires authentication.
 *
 * @param req - The Express request object with user information and validated data.
 * @param res - The Express response object used to send back the result.
 */
export async function createAppealController(
  req: Request<{}, {}, CreateAppealInput>,
  res: Response
) {
  try {
    // No authentication required - userId is null for anonymous users
    const userId = req.user?.id || null;

    // Validate the request body
    // const validatedData = createAppealSchema.parse(req.body);

    // Call the service to save the appeal
    const appealId = await saveAppeal(userId, req.body);
    console.log("appeal id ", appealId)

    // Send back the appeal ID
    return res.status(201).json({
      message: 'Appeal saved successfully',
      appealId: appealId
    });
  } catch (error: any) {
    console.error('Error in createAppealController:', error);
    
    // Handle validation errors
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Invalid request data',
        errors: error.errors
      });
    }
    
    return res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
}
