import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  SerializeOptions,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Page, PagePayload, Id, AuthStrategy, IdGuard } from 'src/shared';
import { CreateUserDto, UpdateUserDto, UserDoc, User } from 'src/mongoose';
import { DocumentQuery } from 'mongoose';

@Controller('api/users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserDoc> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Page() page: PagePayload,
  ): Promise<{ users; maxPage: number; currentPage: number; limit: number }> {
    return this.usersService.findAll(page);
  }

  @Get(':id')
  findById(
    @Id() id: string,
  ): DocumentQuery<UserDoc, UserDoc, Record<string, unknown>> {
    return this.usersService.findById(id);
  }

  // @SerializeOptions({ groups: [UserGroup.UPDATE] })
  @UseGuards(AuthGuard(AuthStrategy.Jwt), IdGuard)
  @Put(':id')
  update(
    @Id() id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard(AuthStrategy.Jwt), IdGuard)
  @Delete(':id')
  async delete(@Id() id: string): Promise<string> {
    
    const user = await this.usersService.delete(id);

    return `${user.id} has been deleted`;
  }
}
