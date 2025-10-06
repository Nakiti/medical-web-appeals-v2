import Update from '../../models/update.model.js';
import { Appeal } from '../../models/appeal.model.js';

/**
 * Finds all updates for a specific appeal, ordered by creation date descending.
 *
 * @param appealId - The ID of the appeal to find updates for.
 * @returns An array of update instances for the appeal.
 * @throws Will throw an error if the database query fails.
 */
export async function findUpdatesByAppealId(appealId: string): Promise<Update[]> {
  try {
    const updates = await Update.findAll({
      where: { appealId },
      order: [['createdAt', 'DESC']], // Order by creation date descending
    });
    
    return updates;
  } catch (error) {
    console.error('Failed to find updates by appeal ID in repository:', error);
    throw new Error('Database error while finding updates by appeal ID.');
  }
}

/**
 * Creates a new update record in the database.
 *
 * @param updateData - An object containing the data for the new update.
 * @returns The newly created update instance from Sequelize.
 * @throws Will throw an error if the database query fails.
 */
export async function createUpdate(updateData: any): Promise<Update> {
  try {
    const newUpdate = await Update.create(updateData);
    return newUpdate;
  } catch (error) {
    console.error('Failed to create update in repository:', error);
    throw new Error('Database error while creating update.');
  }
}

/**
 * Finds a single update by its ID with the parent appeal included.
 * This is used for ownership checks.
 *
 * @param updateId - The ID of the update to find.
 * @returns The update instance with appeal data if found, otherwise null.
 * @throws Will throw an error if the database query fails.
 */
export async function findUpdateByIdWithAppeal(updateId: string): Promise<Update | null> {
  try {
    const update = await Update.findByPk(updateId, {
      include: [{
        model: Appeal,
        as: 'appeal',
        attributes: ['id', 'userId'] // Only include necessary fields for ownership check
      }]
    });
    
    return update;
  } catch (error) {
    console.error('Failed to find update by ID with appeal in repository:', error);
    throw new Error('Database error while finding update by ID with appeal.');
  }
}

/**
 * Updates an update record in the database.
 *
 * @param updateId - The ID of the update to update.
 * @param data - The data to update the update with.
 * @returns The updated update instance if found, otherwise null.
 * @throws Will throw an error if the database query fails.
 */
export async function updateUpdateById(updateId: string, data: Partial<any>): Promise<Update | null> {
  try {
    const update = await Update.findByPk(updateId);
    
    if (!update) {
      return null;
    }

    await update.update(data);
    return update;
  } catch (error) {
    console.error('Failed to update update by ID in repository:', error);
    throw new Error('Database error while updating update by ID.');
  }
}

/**
 * Deletes an update record from the database.
 *
 * @param updateId - The ID of the update to delete.
 * @returns The number of rows deleted (should be 1 if successful, 0 if update not found).
 * @throws Will throw an error if the database query fails.
 */
export async function deleteUpdateById(updateId: string): Promise<number> {
  try {
    const deletedRows = await Update.destroy({
      where: { id: updateId }
    });
    return deletedRows;
  } catch (error) {
    console.error('Failed to delete update by ID in repository:', error);
    throw new Error('Database error while deleting update by ID.');
  }
}

