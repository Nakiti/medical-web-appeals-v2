import { DataTypes, Model, UUIDV4, type Optional } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * @interface UserAttributes
 * @description Attributes for the User model.
 * @property {string} id - The unique identifier for the user (UUID).
 * @property {string} name - The user's full name.
 * @property {string} email - The user's email address (unique).
 * @property {string} password - The user's hashed password.
 * @property {Date} createdAt - The creation timestamp.
 * @property {Date} updatedAt - The last update timestamp.
 */
interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @interface UserCreationAttributes
 * @description Attributes for creating a new user, making 'id' optional as it's auto-generated.
 */
export type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * @class User
 * @description Sequelize model for the 'users' table.
 */
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    sequelize,
    underscored: true,
    indexes: [
      {
      unique: true,
      fields: ['email'],
      name: 'unique_email'
      }
    ]
  }
);
