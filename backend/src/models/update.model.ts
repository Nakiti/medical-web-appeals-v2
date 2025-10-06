import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../config/database.js';
import { Appeal } from './appeal.model.js';

/**
 * @interface UpdateAttributes
 * @description Attributes for the Update model.
 */
interface UpdateAttributes {
  id: string;
  appealId: string;
  title: string;    // The title of the update note.
  content: string;  // The body text of the update note.
  createdAt?: Date;
  updatedAt?: Date;
}

export type UpdateCreationAttributes = Optional<UpdateAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class Update extends Model<UpdateAttributes, UpdateCreationAttributes> implements UpdateAttributes {
  public id!: string;
  public appealId!: string;
  public title!: string;
  public content!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Update.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  appealId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Appeal,
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'updates',
  underscored: true
});


export default Update;

