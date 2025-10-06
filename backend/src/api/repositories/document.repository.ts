import { Document } from '../../models/document.model.js';
import { Appeal } from '../../models/appeal.model.js';

/**
 * Finds all documents associated with a specific appeal.
 *
 * @param appealId - The ID of the appeal to get documents for.
 * @returns A promise that resolves to an array of document objects.
 * @throws Will throw an error if the database query fails.
 */
export async function findAllByAppealId(appealId: string): Promise<any[]> {
  try {
    const documents = await Document.findAll({
      where: { appealId },
      order: [['createdAt', 'DESC']]
    });
    return documents;
  } catch (error) {
    console.error('Error in findAllByAppealId:', error);
    throw new Error('Failed to retrieve documents for appeal.');
  }
}

/**
 * Creates a new document record in the database.
 *
 * @param data - The document data to create.
 * @returns A promise that resolves to the created document object.
 * @throws Will throw an error if the database operation fails.
 */
export async function createDocument(data: any): Promise<any> {
  try {
    const document = await Document.create(data);
    return document;
  } catch (error) {
    console.error('Error in createDocument:', error);
    throw new Error('Failed to create document record.');
  }
}

/**
 * Finds a document by ID and includes its parent appeal for ownership checks.
 *
 * @param documentId - The ID of the document to find.
 * @returns A promise that resolves to the document with its parent appeal, or null if not found.
 * @throws Will throw an error if the database query fails.
 */
export async function findByIdWithAppeal(documentId: string): Promise<any | null> {
  try {
    const document = await Document.findByPk(documentId, {
      include: [{
        model: Appeal,
        as: 'appeal'
      }]
    });
    return document;
  } catch (error) {
    console.error('Error in findByIdWithAppeal:', error);
    throw new Error('Failed to retrieve document with appeal information.');
  }
}

/**
 * Deletes a document by ID from the database.
 *
 * @param documentId - The ID of the document to delete.
 * @returns A promise that resolves to the number of rows deleted.
 * @throws Will throw an error if the database operation fails.
 */
export async function deleteById(documentId: string): Promise<number> {
  try {
    const deletedRows = await Document.destroy({
      where: { id: documentId }
    });
    return deletedRows;
  } catch (error) {
    console.error('Error in deleteById:', error);
    throw new Error('Failed to delete document record.');
  }
}
