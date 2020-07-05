import { UnsupportedMediaTypeException } from '@nestjs/common';
import { diskStorage } from 'multer';
// import { v4 as uuid } from 'uuid';
import { MulterConfig } from '../../interfaces/multer-config.interface';
import { Request, Express } from 'express';

export const avatarMulterConfig: MulterConfig = {
  fieldName: 'avatar',
  dest: 'uploads/avatar/',
  fileSize: 1024 * 1024 * 1024,
  files: 1,
  baseEndpoint: 'uploads/avatar',
  get multerOptions() {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, this.dest);
        },
        // filename: (req, file, cb) => {
        //   const [type, subtype] = file?.mimetype.split('/');
        //   cb(null, `${uuid()}.${subtype}`);
        // },
      }),
      limits: { fileSize: this.fileSize, files: this.files },
      fileFilter: (
        req: Request,
        file: Express.Multer.File,
        cb: (err: Error, canPass: boolean) => void,
      ): void => {
        const regExp = /^image\/(jpg|jpeg|png|gif|bmp)$/;
        const canPass = regExp.test(file?.mimetype);

        if (canPass) {
          cb(null, true);
        } else {
          cb(
            new UnsupportedMediaTypeException('Only an image can be uploaded'),
            false,
          );
        }
      },
    };
  },
};
