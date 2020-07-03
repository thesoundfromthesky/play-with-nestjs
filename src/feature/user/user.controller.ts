import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  //SerializeOptions,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Page, PagePayload, Id, AuthStrategy, IdGuard } from 'src/shared';
import {
  CreateUserDto,
  UpdateUserDto,
  User,
  UserDocumentQuery,
  UserDocument,
} from 'src/mongoose';

@Controller('api/users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Page() page: PagePayload,
  ): Promise<{ users; maxPage: number; currentPage: number; limit: number }> {
    return this.usersService.findAll(page);
  }

  @Get(':id')
  findById(@Id() id: string): UserDocumentQuery {
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
