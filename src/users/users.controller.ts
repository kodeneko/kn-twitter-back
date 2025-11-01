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

@UseFilters(DbErrorServerFilter, DbErrorRequestFilter, DbErrorRequestFilter)
@UseGuards(JwtGuard, AdminGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const created = await this.userService.create(createUserDto);
    return created;
  }

  @Get()
  async findAll(@Query('limit') limit?: string, @Query('skip') skip?: string) {
    return this.userService.findAll({
      limit: limit ? parseInt(limit, 10) : 10,
      skip: skip ? parseInt(skip, 10) : 0,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Public()
  @Get('info')
  async getMyInfo(@Cookie('jwt', UserFromTokenPipe) user: UserDocument) {
    return this.userService.findOne(user._id.toString());
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
