import { findUpdatesByAppealId, createUpdate, findUpdateByIdWithAppeal, updateUpdateById, deleteUpdateById } from '../repositories/update.repository.js';
import { findAppealById } from '../repositories/appeal.repository.js';

/**
 * Gets all updates for a specific appeal with ownership check.
 *
 * @param appealId - The ID of the appeal to get updates for.
 * @param userId - The ID of the user requesting the updates.
 * @returns An array of update objects if the user owns the appeal.
 * @throws Will throw an error if the user is not authorized or if the database query fails.
 */
export async function getUpdatesForAppeal(
  appealId: string,
  userId: string
): Promise<any[]> {
  try {
    // First, get the appeal to check ownership
    const appeal = await findAppealById(appealId);
    
    if (!appeal) {
      throw new Error('Not Found: Appeal not found.');
    }
    
    // Check ownership
    if (appeal.userId !== userId) {
      throw new Error('Forbidden: You are not authorized to view updates for this appeal.');
    }
    
    // Get updates for the appeal
    const updates = await findUpdatesByAppealId(appealId);
    return updates;
  } catch (error) {
    console.error('Error in getUpdatesForAppeal service:', error);
    throw error; // Re-throw to preserve the original error message
  }
}

/**
 * Creates a new update for a specific appeal with ownership check.
 *
 * @param appealId - The ID of the appeal to add the update to.
 * @param userId - The ID of the user creating the update.
 * @param title - The title of the update.
 * @param content - The content of the update.
 * @returns The newly created update object.
 * @throws Will throw an error if the user is not authorized or if the creation fails.
 */
export async function createUpdateForAppeal(
  appealId: string,
  userId: string,
  title: string,
  content: string
): Promise<any> {
  try {
    // First, get the appeal to check ownership
    const appeal = await findAppealById(appealId);
    
    if (!appeal) {
      throw new Error('Not Found: Appeal not found.');
    }
    
    // Check ownership
    if (appeal.userId !== userId) {
      throw new Error('Forbidden: You are not authorized to add updates to this appeal.');
    }
    
    // Create the update
    const updateData = {
      appealId,
      title,
      content
    };
    
    const newUpdate = await createUpdate(updateData);
    return newUpdate;
  } catch (error) {
    console.error('Error in createUpdateForAppeal service:', error);
    throw error; // Re-throw to preserve the original error message
  }
}

/**
 * Updates an existing update with nested ownership check.
 *
 * @param updateId - The ID of the update to update.
 * @param userId - The ID of the user making the request.
 * @param data - The data to update the update with.
 * @returns The updated update object.
 * @throws Will throw an error if the user is not authorized or if the update fails.
 */
export async function updateUserNote(
  updateId: string,
  userId: string,
  data: { title?: string; content?: string }
): Promise<any> {
  try {
    // First, get the update with its parent appeal for ownership check
    const update = await findUpdateByIdWithAppeal(updateId);
    
    if (!update) {
      throw new Error('Not Found: Update not found.');
    }
    
    // Check ownership through the parent appeal
    if (!update.appeal || update.appeal.userId !== userId) {
      throw new Error('Forbidden: You are not authorized to update this note.');
    }
    
    // Update the update
    const updatedUpdate = await updateUpdateById(updateId, data);
    return updatedUpdate;
  } catch (error) {
    console.error('Error in updateUserNote service:', error);
    throw error; // Re-throw to preserve the original error message
  }
}

/**
 * Deletes an update with nested ownership check.
 *
 * @param updateId - The ID of the update to delete.
 * @param userId - The ID of the user making the request.
 * @returns The number of rows deleted (1 if successful, 0 if not found).
 * @throws Will throw an error if the user is not authorized or if the deletion fails.
 */
export async function deleteUserNote(
  updateId: string,
  userId: string
): Promise<number> {
  try {
    // First, get the update with its parent appeal for ownership check
    const update = await findUpdateByIdWithAppeal(updateId);
    
    if (!update) {
      throw new Error('Not Found: Update not found.');
    }
    
    // Check ownership through the parent appeal
    if (!update.appeal || update.appeal.userId !== userId) {
      throw new Error('Forbidden: You are not authorized to delete this note.');
    }
    
    // Delete the update
    const deletedRows = await deleteUpdateById(updateId);
    return deletedRows;
  } catch (error) {
    console.error('Error in deleteUserNote service:', error);
    throw error; // Re-throw to preserve the original error message
  }
}

