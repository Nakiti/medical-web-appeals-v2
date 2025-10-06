import { Sequelize } from 'sequelize';
import { User } from './user.model.js';
import { Appeal } from './appeal.model.js';
import { Document } from './document.model.js';
import Update from './update.model.js';
import dotenv from 'dotenv';

dotenv.config(); 

// Ensure all required environment variables are set
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT } = process.env;
if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_DIALECT) {
  throw new Error('Missing database environment variables');
}

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT as any, // Cast to any to avoid dialect type issues
  logging: false, // Set to console.log to see SQL queries
});

// Initialize models
User.init;
Appeal.init;
Document.init;
Update.init;

// --- Define Associations ---

// A User can have many Appeals
User.hasMany(Appeal, {
  foreignKey: 'userId',
  as: 'appeals', // This alias is used for eager loading
});

// An Appeal belongs to one User
Appeal.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// An Appeal can have many Documents
Appeal.hasMany(Document, {
  foreignKey: 'appealId',
  as: 'documents',
});

// A Document belongs to one Appeal
Document.belongsTo(Appeal, {
  foreignKey: 'appealId',
  as: 'appeal',
});

// An Appeal can have many Updates
Appeal.hasMany(Update, {
  foreignKey: 'appealId',
  as: 'updates',
});

// An Update belongs to one Appeal
Update.belongsTo(Appeal, {
  foreignKey: 'appealId',
  as: 'appeal',
});

export { User, Appeal, Document, Update };
