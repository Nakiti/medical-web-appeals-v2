import { DataTypes, Model, UUIDV4, type Optional } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * @interface DocumentAttributes
 * @description Attributes for the Document model.
 * @property {string} id - The unique identifier for the document (UUID).
 * @property {string} appealId - The foreign key linking to the Appeal model.
 * @property {string} fileName - The original name of the uploaded file.
 * @property {string} fileUrl - The URL of the file stored in Azure Blob Storage.
 * @property {string} fileType - The MIME type of the file.
 * @property {number} fileSize - The size of the file in bytes.
 */
interface DocumentAttributes {
  id: string;
  appealId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @interface DocumentCreationAttributes
 * @description Attributes for creating a new document, making 'id' optional.
 */
export type DocumentCreationAttributes = Optional<DocumentAttributes, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * @class Document
 * @description Sequelize model for the 'documents' table.
 */
export class Document extends Model<DocumentAttributes, DocumentCreationAttributes> implements DocumentAttributes {
  public id!: string;
  public appealId!: string;
  public fileName!: string;
  public fileUrl!: string;
  public fileType!: string;
  public fileSize!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Document.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    appealId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'appeals',
        key: 'id',
      },
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'documents',
    sequelize,
    underscored: true
  }
);
