import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export interface MulterConfig {
  fieldName: string;
  dest: string;
  fileSize: number;
  files: number;
  multerOptions: MulterOptions;
}
