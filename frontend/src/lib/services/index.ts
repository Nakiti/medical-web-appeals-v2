// Auth services
export { registerUser, loginUser, getSession, logoutUser, initializeAuth } from './auth.service';

// User services
export { getUserProfile, updateUserProfile, deleteUserAccount } from './user.service';

// Appeals services
export { 
  getUserAppeals, 
  getAppealById, 
  updateAppeal, 
  deleteAppeal, 
  parseDenialLetter, 
  generateAppealLetter, 
  createAppeal 
} from './appeals.service';

// Documents services
export { 
  getAppealDocuments, 
  uploadAppealDocuments, 
  deleteDocument 
} from './documents.service';

// Updates services
export { 
  getAppealUpdates, 
  createAppealUpdate, 
  updateAppealUpdate, 
  deleteAppealUpdate 
} from './updates.service';

// File upload services
export { 
  validateDenialLetterFile, 
  formatFileSize, 
  getFileExtension, 
  isSupportedFileType, 
  createFilePreview, 
  revokeFilePreview 
} from './fileUpload.service';
