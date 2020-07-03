import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Post,
  UseGuards,
  Get,
  Res,
  Put,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { avatarMulterConfig } from 'src/core';
import { Express, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategy, IdGuard, Id } from 'src/shared';
import { User } from 'src/mongoose';
import { AvatarService } from './avatar.service';

@Controller(`api/${avatarMulterConfig.baseEndpoint}`)
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @UseGuards(AuthGuard(AuthStrategy.Jwt), IdGuard)
  @UseInterceptors(
    FileInterceptor(
      avatarMulterConfig.fieldName,
      avatarMulterConfig.multerOptions,
    ),
  )
  @Post(':id')
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Id() id: string,
  ): Promise<string> {
    await this.avatarService.create(file, id);
    const imgUrl = `${this.avatarService.baseUrl}/api/${avatarMulterConfig.baseEndpoint}/${id}`;

    await this.avatarService.updateUser(id, {
      avatar: imgUrl,
    } as User);

    return imgUrl;
  }

  @Get(':id')
  async findByUserId(@Id() id: string, @Res() res: Response): Promise<void> {
    const data = await this.avatarService.findByUserId(id);
    res.sendFile(`${avatarMulterConfig.dest}/${data.filename}`, {
      root: process.cwd(),
      headers: { 'Content-Type': data.mimetype },
    });
  }

  @UseGuards(AuthGuard(AuthStrategy.Jwt), IdGuard)
  @UseInterceptors(
    FileInterceptor(
      avatarMulterConfig.fieldName,
      avatarMulterConfig.multerOptions,
    ),
  )
  @Put(':id')
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Id() id: string,
  ): Promise<string> {
    await this.avatarService.update(id, file);

    const imgUrl = `${this.avatarService.baseUrl}/api/${avatarMulterConfig.baseEndpoint}/${id}`;

    return imgUrl;
  }

  @Delete(':id')
  async delete(@Id() id: string): Promise<string> {
    const avatar = await this.avatarService.delete(id);

    return `${avatar.user} has been deleted`;
  }
}
