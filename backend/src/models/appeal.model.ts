import { DataTypes, Model, UUIDV4, type Optional } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * @enum AppealStatus
 * @description The possible statuses for an appeal.
 */
export enum AppealStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  DENIED = 'denied',
}

/**
 * @interface AppealAttributes
 * @description Attributes for the Appeal model.
 * @property {string} id - The unique identifier for the appeal (UUID).
 * @property {string} userId - The foreign key linking to the User model.
 * @property {string} denialLetterUrl - The URL of the uploaded letter in Azure Blob Storage.
 * @property {object} parsedData - The JSON object containing data extracted from the letter.
 * @property {string} generatedLetter - The full text of the generated appeal letter.
 * @property {string} generatedLetterUrl - The URL of the generated PDF in Azure Blob Storage.
 * @property {AppealStatus} status - The current status of the appeal.
 */
interface AppealAttributes {
  id: string;
  userId?: string;
  denialLetterUrl: string;
  parsedData: object;
  generatedLetter: string;
  generatedLetterUrl: string;
  status: AppealStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @interface AppealCreationAttributes
 * @description Attributes for creating a new appeal, making 'id' optional.
 */
export type AppealCreationAttributes = Optional<AppealAttributes, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * @class Appeal
 * @description Sequelize model for the 'appeals' table.
 */
export class Appeal extends Model<AppealAttributes, AppealCreationAttributes> implements AppealAttributes {
  public id!: string;
  public userId?: string;
  public denialLetterUrl!: string;
  public parsedData!: object;
  public generatedLetter!: string;
  public generatedLetterUrl!: string;
  public status!: AppealStatus; 

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Appeal.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID, 
      allowNull: true,
      references: {
        model: 'users', // This is a reference to another model
        key: 'id',
      },
    },
    denialLetterUrl: {
      type: DataTypes.STRING,
      allowNull: true, // May be null initially
    },
    parsedData: {
      type: DataTypes.JSON,
      allowNull: true, // May be null initially
    },
    generatedLetter: {
      type: DataTypes.TEXT, // Use TEXT for longer strings
      allowNull: true,
    },
    generatedLetterUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(AppealStatus)),
      defaultValue: AppealStatus.DRAFT,
      allowNull: false,
    },
  },
  {
    tableName: 'appeals',
    sequelize,
    underscored: true
  }
);
