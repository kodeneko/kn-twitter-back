import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { DbErrorServerFilter } from 'src/common/filters/db/db-error-server.filter';
import { DbErrorRequestFilter } from 'src/common/filters/db/db-error-request.filter';
import { JwtGuard } from 'src/auth/jwt.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { Cookie } from 'src/common/decorators/cookie.decorator';
import { UserFromTokenPipe } from 'src/common/pipes/user-from-token.pipe';
import type { UserDocument } from './schemas/user.schema';
import { Public } from 'src/common/decorators/public.decorator';
import { TwErrorAccessFilter } from 'src/common/filters/twitter/tw-error-access.filter';
import { TwErrorRequestFilter } from 'src/common/filters/twitter/tw-error-request.filter';
import { TwErrorServerFilter } from 'src/common/filters/twitter/tw-error-server.filter';
import { TwErrorLimitsFilter } from 'src/common/filters/twitter/tw-limits.filter';
import { UsersTwitterService } from './user-twitter.service';

@UseFilters(
  TwErrorAccessFilter,
  TwErrorRequestFilter,
  TwErrorServerFilter,
  TwErrorLimitsFilter,
  DbErrorServerFilter,
  DbErrorRequestFilter,
  DbErrorRequestFilter,
)
@UseGuards(JwtGuard, AdminGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly usersTwitterService: UsersTwitterService,
  ) {}

  @Public()
  @Get('info')
  async getMyInfo(@Cookie('jwt', UserFromTokenPipe) user: UserDocument) {
    return this.userService.findOne(user._id.toString());
  }

  @Public()
  @Get('twitter')
  async getInfoTwitter(@Cookie('jwt', UserFromTokenPipe) user: UserDocument) {
    return this.usersTwitterService.get(user._id.toString());
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Get()
  async findAll(@Query('limit') limit?: string, @Query('skip') skip?: string) {
    return this.userService.findAll({
      limit: limit ? parseInt(limit, 10) : 10,
      skip: skip ? parseInt(skip, 10) : 0,
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const created = await this.userService.create(createUserDto);
    return created;
  }

  @Put()
  async put(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: string) {
    return this.userService.delete(id);
  }
}
