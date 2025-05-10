import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { nanoid } from 'nanoid';
import mime from 'mime-types';
import { Middleware } from '../../libs/middleware/index.js';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = process.env.UPLOADS_DIR || './uploads';
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = mime.extension(file.mimetype) || '';
    const filename = `${nanoid()}.${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

export class FileUploadMiddleware implements Middleware {
  public execute(req: Request, res: Response, next: NextFunction): void {
    upload.single('file')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Multer error occurred during file upload.' });
      } else if (err) {
        console.log(err);
        return res.status(500).json({ message: 'An unknown error occurred during file upload.' });
      }
      return next();
    });
  }
}
