import { findByIdWithAppeal, deleteById } from '../repositories/document.repository.js';
import { azureBlobService } from './azure.service.js';

/**
 * Deletes a document with ownership check and Azure cleanup.
 *
 * @param documentId - The ID of the document to delete.
 * @param userId - The ID of the user requesting the deletion.
 * @returns The number of rows deleted (1 if successful, 0 if not found).
 * @throws Will throw an error if the user is not authorized or if the deletion fails.
 */
export async function deleteDocument(
  documentId: string,
  userId: string
): Promise<number> {
  try {
    // Get the document with its parent appeal for ownership check
    const document = await findByIdWithAppeal(documentId);
    
    if (!document) {
      return 0; // Document not found
    }
    
    // Check ownership through the appeal
    if (document.appeal.userId !== userId) {
      throw new Error('Forbidden: You are not authorized to delete this document.');
    }
    
    // Delete from Azure Blob Storage
    try {
      await azureBlobService.deleteFile(document.fileUrl);
    } catch (azureError) {
      console.error('Error deleting file from Azure:', azureError);
      // Continue with database deletion even if Azure deletion fails
    }
    
    // Delete from database
    const deletedRows = await deleteById(documentId);
    return deletedRows;
  } catch (error) {
    console.error('Error in deleteDocument service:', error);
    throw error; // Re-throw to preserve the original error message
  }
}
