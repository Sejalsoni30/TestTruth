import multer from 'multer';

// Use memory storage for direct streaming & validation before persisting
const storage = multer.memoryStorage();

export const uploadZipOrFiles = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB max per file
    files: 50,
  },
  fileFilter: (_req, file, cb) => {
    const allowedMime = [
      'application/zip',
      'application/x-zip-compressed',
      'application/octet-stream',
      'text/javascript',
      'text/typescript',
      'text/plain',
      'application/json',
    ];
    
    // Check file extension
    const validExtensions = /\.(zip|js|jsx|ts|tsx|json|md)$/i;
    if (validExtensions.test(file.originalname) || allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.originalname}. Only ZIP archives and JS/TS/JSON source files are allowed.`));
    }
  },
});

