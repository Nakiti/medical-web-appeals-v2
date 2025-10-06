import { Appeal, AppealStatus } from '../../models/appeal.model.js';

/**
 * Interface for appeal filters
 */
export interface AppealFilters {
  status?: AppealStatus;
}

/**
 * Finds appeals by user ID with optional filters.
 *
 * @param userId - The ID of the user to find appeals for.
 * @param filters - Optional filters to apply to the query.
 * @returns An array of appeal instances matching the criteria.
 * @throws Will throw an error if the database query fails.
 */
export async function findAppealsByUserId(
  userId: string,
  filters?: AppealFilters
): Promise<Appeal[]> {
  try {
    const whereClause: any = { userId };
    
    // Apply filters if provided
    if (filters?.status) {
      whereClause.status = filters.status;
    }

    const appeals = await Appeal.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']], // Order by creation date descending
    });
    
    return appeals;
  } catch (error) {
    console.error('Failed to find appeals by user ID in repository:', error);
    throw new Error('Database error while finding appeals by user ID.');
  }
}

/**
 * Finds a single appeal by its ID and user ID.
 * This ensures users can only access their own appeals.
 *
 * @param appealId - The ID of the appeal to find.
 * @param userId - The ID of the user who owns the appeal.
 * @returns The appeal instance if found and owned by the user, otherwise null.
 * @throws Will throw an error if the database query fails.
 */
export async function findAppealByIdAndUserId(
  appealId: string,
  userId: string
): Promise<Appeal | null> {
  try {
    const appeal = await Appeal.findOne({
      where: { 
        id: appealId,
        userId 
      }
    });
    
    return appeal;
  } catch (error) {
    console.error('Failed to find appeal by ID and user ID in repository:', error);
    throw new Error('Database error while finding appeal by ID and user ID.');
  }
}

/**
 * Creates a new appeal record in the database.
 *
 * @param appealData - An object containing the data for the new appeal.
 * @returns The ID of the newly created appeal.
 * @throws Will throw an error if the database query fails.
 */
export async function createAppeal(appealData: any): Promise<string> {
  try {
    const newAppeal = await Appeal.create(appealData);
    console.log("new appeal ", newAppeal)
    const newAppealData = newAppeal.toJSON()
    return newAppealData.id;
  } catch (error) {
    console.error('Failed to create appeal in repository:', error);
    throw new Error('Database error while creating appeal.');
  }
}

/**
 * Updates an appeal record in the database.
 *
 * @param appealId - The ID of the appeal to update.
 * @param userId - The ID of the user who owns the appeal.
 * @param data - The data to update the appeal with.
 * @returns The updated appeal instance if found and owned by the user, otherwise null.
 * @throws Will throw an error if the database query fails.
 */
export async function updateAppeal(
  appealId: string,
  userId: string,
  data: Partial<any>
): Promise<Appeal | null> {
  try {
    const appeal = await Appeal.findOne({
      where: { 
        id: appealId,
        userId 
      }
    });
    
    if (!appeal) {
      return null;
    }

    await appeal.update(data);
    return appeal;
  } catch (error) {
    console.error('Failed to update appeal in repository:', error);
    throw new Error('Database error while updating appeal.');
  }
}

/**
 * Finds a single appeal by its primary key.
 *
 * @param id - The ID of the appeal to find.
 * @returns The appeal instance if found, otherwise null.
 * @throws Will throw an error if the database query fails.
 */
export async function findAppealById(id: string): Promise<Appeal | null> {
  try {
    const appeal = await Appeal.findByPk(id);
    return appeal;
  } catch (error) {
    console.error('Failed to find appeal by ID in repository:', error);
    throw new Error('Database error while finding appeal by ID.');
  }
}

/**
 * Updates an appeal record in the database by ID.
 *
 * @param id - The ID of the appeal to update.
 * @param data - The data to update the appeal with.
 * @returns The updated appeal instance if found, otherwise null.
 * @throws Will throw an error if the database query fails.
 */
export async function updateAppealById(id: string, data: Partial<any>): Promise<Appeal | null> {
  try {
    const appeal = await Appeal.findByPk(id);
    
    if (!appeal) {
      return null;
    }

    await appeal.update(data);
    return appeal;
  } catch (error) {
    console.error('Failed to update appeal by ID in repository:', error);
    throw new Error('Database error while updating appeal by ID.');
  }
}

/**
 * Deletes an appeal record from the database.
 *
 * @param appealId - The ID of the appeal to delete.
 * @param userId - The ID of the user who owns the appeal.
 * @returns The number of rows deleted (should be 1 if successful, 0 if appeal not found).
 * @throws Will throw an error if the database query fails.
 */
export async function deleteAppeal(appealId: string, userId: string): Promise<number> {
  try {
    const deletedRows = await Appeal.destroy({
      where: { 
        id: appealId,
        userId 
      }
    });
    return deletedRows;
  } catch (error) {
    console.error('Failed to delete appeal in repository:', error);
    throw new Error('Database error while deleting appeal.');
  }
}
