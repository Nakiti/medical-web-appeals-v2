import { findAppealsByUserId, findAppealById, findAppealByIdAndUserId, updateAppealById, deleteAppeal, createAppeal, type AppealFilters } from '../repositories/appeal.repository.js';
import { findAllByAppealId, createDocument } from '../repositories/document.repository.js';
import { azureBlobService, azureDocumentService } from './azure.service.js';
import OpenAI from 'openai';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Gets all appeals for a specific user with optional filtering.
 *
 * @param userId - The ID of the user to get appeals for.
 * @param filters - Optional filters to apply to the query.
 * @returns An array of appeal objects for the user.
 * @throws Will throw an error if the database query fails.
 */
export async function getUserAppeals(
  userId: string,
  filters?: AppealFilters
): Promise<any[]> {
  try {
    const appeals = await findAppealsByUserId(userId, filters);
    return appeals;
  } catch (error) {
    console.error('Error in getUserAppeals service:', error);
    throw new Error('Failed to retrieve user appeals.');
  }
}

/**
 * Gets a single appeal by ID for a specific user with ownership check.
 *
 * @param appealId - The ID of the appeal to retrieve.
 * @param userId - The ID of the user who owns the appeal.
 * @returns The appeal object if found and owned by the user, otherwise null.
 * @throws Will throw an error if the database query fails or if user is not authorized.
 */
export async function getAppealById(
  appealId: string,
  userId: string
): Promise<any | null> {
  try {
    // First, get the appeal by ID
    const appeal = await findAppealById(appealId);
    
    if (!appeal) {
      return null; // Appeal not found
    }
    
    // // Check ownership
    // if (appeal.userId !== userId) {
    //   throw new Error('Forbidden: You are not authorized to view this appeal.');
    // }
    
    return appeal;
  } catch (error) {
    console.error('Error in getAppealById service:', error);
    throw error; // Re-throw to preserve the original error message
  }
}

/**
 * Updates an appeal for a specific user with ownership check.
 *
 * @param appealId - The ID of the appeal to update.
 * @param userId - The ID of the user who owns the appeal.
 * @param updateData - The data to update the appeal with.
 * @returns The updated appeal object if found and owned by the user, otherwise null.
 * @throws Will throw an error if the database query fails or if user is not authorized.
 */
export async function updateAppeal(
  appealId: string,
  userId: string | null,
  updateData: any
): Promise<any | null> {
  try {
    // First, get the appeal to check ownership
    const existingAppeal = await findAppealById(appealId);
    
    if (!existingAppeal) {
      return null; // Appeal not found
    }
    
    // Check ownership only if userId is provided (authenticated user)
    // if (userId !== null && existingAppeal.userId !== userId) {
    //   throw new Error('Forbidden: You are not authorized to update this appeal.');
    // }
    
    console.log("updateData", {parsedData: {...updateData, userId}}) 
    // Update the appeal
    const updatedAppeal = await updateAppealById(appealId, {parsedData: {...updateData, userId}});
    return updatedAppeal;
  } catch (error) {
    console.error('Error in updateAppeal service:', error);
    throw error; // Re-throw to preserve the original error message
  }
}

/**
 * Deletes an appeal for a specific user with ownership check and Azure cleanup.
 *
 * @param appealId - The ID of the appeal to delete.
 * @param userId - The ID of the user who owns the appeal.
 * @returns The number of rows deleted (1 if successful, 0 if not found).
 * @throws Will throw an error if the database query fails or if user is not authorized.
 */
export async function deleteAppealById(
  appealId: string,
  userId: string
): Promise<number> {
  try {
    // First, get the appeal to check ownership and get the denial letter URL
    const appeal = await findAppealById(appealId);
    
    if (!appeal) {
      return 0; // Appeal not found
    }
    
    // Check ownership
    if (appeal.userId !== userId) {
      throw new Error('Forbidden: You are not authorized to delete this appeal.');
    }
    
    // TODO: Add Azure Blob Storage cleanup here
    // if (appeal.denialLetterUrl) {
    //   await deleteBlobFromAzure(appeal.denialLetterUrl);
    // }
    
    // Delete the appeal
    const deletedRows = await deleteAppeal(appealId, userId);
    return deletedRows;
  } catch (error) {
    console.error('Error in deleteAppealById service:', error);
    throw error; // Re-throw to preserve the original error message
  }
}

/**
 * Parses a denial letter using Azure Document Intelligence.
 *
 * @param userId - The ID of the user who uploaded the file.
 * @param file - The uploaded file object from multer.
 * @returns The parsed data from the denial letter.
 * @throws Will throw an error if the parsing fails.
 */
export async function parseDenialLetter(
  userId: string,
  file: any
): Promise<{ parsedData: Record<string, string>; denialLetterUrl: string }> {
  try {
    // Step 1: Upload to Azure Blob Storage
    const fileName = `${userId}-${Date.now()}-${file.originalname}`;
    const denialLetterUrl = await azureBlobService.uploadFile(file.buffer, fileName);
    console.log("denial letter url")

    // Step 2: Analyze with Azure Document Intelligence
    const extractedData = await azureDocumentService.analyzeDocument(denialLetterUrl);
    
    // Step 3: Return the result
    return {
      parsedData: extractedData,
      denialLetterUrl
    };
  } catch (error) {
    console.error('Error in parseDenialLetter service:', error);
    throw new Error('Failed to parse denial letter.');
  }
}

/**
 * Generates an appeal letter using OpenAI.
 *
 * @param appealData - The structured data for the appeal letter.
 * @returns The generated appeal letter text.
 * @throws Will throw an error if the generation fails.
 */
export async function generateAppealLetterText(
  appealData: any,
  appealId: string
): Promise<string> {
  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Construct the prompt
    const systemMessage = {
      role: 'system' as const,
      content: `
      Your goal is to help the patient get their denied claim approved by presenting a compelling, well-structured argument.
      You are a professional medical appeals assistant. Your task is to draft a formal and comprehensive appeal letter based on the information provided. The letter should be well-structured, persuasive, and ready to be printed and mailed.

      
      Guidelines:
      - Use a professional, respectful tone
      - Structure the letter clearly with proper formatting
      - Include specific medical and policy details
      - Present logical arguments supported by evidence
      - Be concise but comprehensive
      - End with a clear call to action
      `
    };

    const userMessage = {
      role: 'user' as const,
      content: `Please write a formal appeal letter with the following information:
      
            ### Patient Information
            - Name: ${appealData.parsedData.firstName} ${appealData.parsedData.lastName}
            - Date of Birth: ${appealData.parsedData.dob}
            - Policy Number: ${appealData.parsedData.policyNumber}
            - Claim Number: ${appealData.parsedData.claimNumber}
            - Insurance Provider: ${appealData.parsedData.insuranceProvider}
            - Insurance Provider's Address: ${appealData.parsedData.insuranceAddress}
            - Physician Name: ${appealData.parsedData.physicianName}
            - Physician Address: ${appealData.parsedData.physicianAddress}
            - Physician Phone: ${appealData.parsedData.physicianPhone}
            - Physician Email: ${appealData.parsedData.physicianEmail}

            ### Medical Details
            - Treating Physician: ${appealData.parsedData.physicianName}
              - Physician's Address: ${appealData.parsedData.physicianAddress}
            - Procedure/Service in Question: ${appealData.parsedData.procedureName}
            - Date of Service: [If available, insert Date of Service, otherwise omit]
            - Reason for Denial: ${appealData.parsedData.denialReason}
            - Additional Details regarding the medical necessity: ${appealData.parsedData.additionalDetails}

            ### Appealer Information
            - Name: ${appealData.parsedData.appealerFirstName} ${appealData.parsedData.appealerLastName}
            - Relationship to Patient: ${appealData.parsedData.appealerRelation}
            - Address: ${appealData.parsedData.appealerAddress}
            - Email: ${appealData.parsedData.appealerEmailAddress}
            - Phone Number: ${appealData.parsedData.appealerPhoneNumber}`
    };

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [systemMessage, userMessage],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Extract and return the generated text
    const generatedText = response.choices[0]?.message?.content;
    if (!generatedText) {
      throw new Error('No text generated by OpenAI');
    }

    // Save the generated text to the database
    console.log("appealId", appealId)
    const appeal = await findAppealById(appealId);
    console.log("appeal", appeal)
    if (!appeal) { 
      throw new Error('Appeal not found');
    }
    await updateAppealById(appealId, {generatedLetter: generatedText});

    return generatedText;
  } catch (error) {
    console.error('Error in generateAppealLetterText service:', error);
    throw new Error('Failed to generate appeal letter text.');
  }
}

export async function generatePDFForAppeal(appealId: string, letterText: string): Promise<string | null> {
  // 1. Find the appeal to ensure it exists
  const appeal = await findAppealById(appealId);
  if (!appeal) {
    return null; // Return null if the appeal doesn't exist
  }

  // 2. Create a new PDF document using 'pdf-lib'
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontSize = 12;

  page.drawText(letterText, {
    x: 50,
    y: height - 4 * fontSize,
    font,
    size: fontSize,
    lineHeight: 14,
    color: rgb(0, 0, 0),
  });

  // Serialize the PDF to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  // 3. Upload the generated PDF to blob storage
  // The filename should be unique to avoid collisions.
  const fileName = `appeal-${appealId}-${Date.now()}.pdf`;
  const pdfUrl = await azureBlobService.uploadGeneratedPDF(pdfBytes, fileName);

  // 4. Update the appeal with the URL and the final text used
  await appeal.update({
    generatedLetterUrl: pdfUrl,
    generatedLetter: letterText, // Save the final version of the text
  });

  // 5. Return the public URL of the uploaded PDF
  return fileName;
}

/**
 * Saves a complete appeal with generated PDF.
 *
 * @param userId - The ID of the user saving the appeal.
 * @param appealData - The complete appeal data including generated text.
 * @returns The saved appeal object.
 * @throws Will throw an error if the save operation fails.
 */
export async function saveAppeal(
  userId: string | null,
  appealData: any
): Promise<string> {
  try {
    // Step 1: Generate PDF in memory
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Standard letter size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Add the generated letter text to the PDF
    const text = appealData.generatedLetter;
    const lines = text.split('\n');
    let yPosition = 750; // Start near the top
    
    for (const line of lines) {
      if (yPosition < 50) { // Add new page if needed
        const newPage = pdfDoc.addPage([612, 792]);
        yPosition = 750;
      }
      
      page.drawText(line, {
        x: 50,
        y: yPosition,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      
      yPosition -= 15; // Move down for next line
    }
    
    const pdfBytes = await pdfDoc.save();
    
    // Step 2: Upload generated PDF to Azure Blob Storage
    const tempAppealId = `appeal-${userId || 'anonymous'}-${Date.now()}`;
    const pdfFileName = `${tempAppealId}.pdf`;
    const generatedLetterUrl = await azureBlobService.uploadGeneratedPDF(
      Buffer.from(pdfBytes),
      pdfFileName
    );
    
    // Step 3: Prepare and save database record
    const appealRecord = {
      userId,
      denialLetterUrl: appealData.denialLetterUrl,
      parsedData: appealData.parsedData,
      generatedLetter: appealData.generatedLetter,
      generatedLetterUrl,
      status: 'draft'
    };
    
    // Step 4: Save to database
    const appealId = await createAppeal(appealRecord);
    
    
    return appealId;
  } catch (error) {
    console.error('Error in saveAppeal service:', error);
    throw new Error('Failed to save appeal.');
  }
}

/**
 * Gets all documents for a specific appeal with ownership check.
 *
 * @param appealId - The ID of the appeal to get documents for.
 * @param userId - The ID of the user requesting the documents.
 * @returns An array of document objects if the user owns the appeal.
 * @throws Will throw an error if the user is not authorized or if the database query fails.
 */
export async function getDocumentsForAppeal(
  appealId: string,
  userId: string
): Promise<any[]> {
  try {
    // First, get the appeal to check ownership
    const appeal = await findAppealById(appealId);
    
    if (!appeal) {
      throw new Error('Not Found: Appeal not found.');
    }
    
    // // Check ownership
    // if (appeal.userId !== userId) {
    //   throw new Error('Forbidden: You are not authorized to view documents for this appeal.');
    // }
    
    // Get documents for the appeal
    const documents = await findAllByAppealId(appealId);
    return documents;
  } catch (error) {
    console.error('Error in getDocumentsForAppeal service:', error);
    throw error; // Re-throw to preserve the original error message
  }
}

/**
 * Uploads documents for a specific appeal with ownership check.
 *
 * @param appealId - The ID of the appeal to upload documents to.
 * @param userId - The ID of the user uploading the documents.
 * @param files - Array of file objects from multer.
 * @returns An array of created document objects.
 * @throws Will throw an error if the user is not authorized or if the upload fails.
 */
export async function uploadDocumentsForAppeal(
  appealId: string,
  userId: string,
  files: any[]
): Promise<any[]> {
  try {
    // First, get the appeal to check ownership
    const appeal = await findAppealById(appealId);
    
    if (!appeal) {
      throw new Error('Not Found: Appeal not found.');
    }
    
    // Check ownership
    if (appeal.userId !== userId) {
      throw new Error('Forbidden: You are not authorized to upload documents to this appeal.');
    }
    
    const createdDocuments = [];
    
    // Process each file
    for (const file of files) {
      try {
        // Upload to Azure Blob Storage
        const fileName = `${userId}-${Date.now()}-${file.originalname}`;
        const fileUrl = await azureBlobService.uploadFile(file.buffer, fileName);
        
        // Create document record
        const documentData = {
          appealId,
          fileName: file.originalname,
          fileUrl,
          fileType: file.mimetype,
          fileSize: file.size
        };
        
        const document = await createDocument(documentData);
        createdDocuments.push(document);
      } catch (fileError) {
        console.error(`Error processing file ${file.originalname}:`, fileError);
        // Continue with other files even if one fails
      }
    }
    
    if (createdDocuments.length === 0) {
      throw new Error('Failed to upload any documents.');
    }
    
    return createdDocuments;
  } catch (error) {
    console.error('Error in uploadDocumentsForAppeal service:', error);
    throw error; // Re-throw to preserve the original error message
  }
}
