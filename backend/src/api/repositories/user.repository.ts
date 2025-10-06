import { User, type UserCreationAttributes } from "../../models/user.model.js";

/**
 * Creates a new user record in the database.
 *
 * @param userData - An object containing the data for the new user.
 * @returns The newly created user instance from Sequelize.
 * @throws Will throw an error if the database query fails.
 */
export async function createUser(
  userData: UserCreationAttributes
): Promise<User> {
  try {
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.error('Failed to create user in repository:', error);
    // Re-throw the error to be handled by the service/controller
    throw new Error('Database error while creating user.');
  }
}

/**
 * Finds a user by their email address.
 *
 * @param email - The email of the user to find.
 * @returns The user instance if found, otherwise null.
 */
export async function findUserByEmail(email: string): Promise<User | null> {
    try {
        const user = await User.findOne({ where: { email } });
        return user;
    } catch (error) {
        console.error('Failed to find user by email in repository:', error);
        throw new Error('Database error while finding user by email.');
    }
}

/**
 * Finds a user by their primary key (ID).
 * Excludes the password field for security.
 *
 * @param id - The ID of the user to find.
 * @returns The user instance if found, otherwise null.
 */
export async function findUserById(id: string): Promise<User | null> {
    try {
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
        return user;
    } catch (error) {
        console.error('Failed to find user by ID in repository:', error);
        throw new Error('Database error while finding user by ID.');
    }
}

/**
 * Updates a user record in the database.
 * Excludes the password field from the return value for security.
 *
 * @param id - The ID of the user to update.
 * @param data - The data to update the user with.
 * @returns The updated user instance if found, otherwise null.
 */
export async function updateUser(id: string, data: Partial<UserCreationAttributes>): Promise<User | null> {
    try {
        const user = await User.findByPk(id);
        
        if (!user) {
            return null;
        }

        await user.update(data);
        
        // Return the updated user without the password field
        const updatedUser = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
        
        return updatedUser;
    } catch (error) {
        console.error('Failed to update user in repository:', error);
        throw new Error('Database error while updating user.');
    }
}

/**
 * Permanently deletes a user record from the database.
 *
 * @param id - The ID of the user to delete.
 * @returns The number of rows deleted (should be 1 if successful, 0 if user not found).
 */
export async function deleteUser(id: string): Promise<number> {
    try {
        const deletedRows = await User.destroy({ where: { id } });
        return deletedRows;
    } catch (error) {
        console.error('Failed to delete user in repository:', error);
        throw new Error('Database error while deleting user.');
    }
}