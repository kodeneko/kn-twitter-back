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
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { DbErrorServerFilter } from 'src/common/filters/db/db-error-server.filter';
import { DbErrorRequestFilter } from 'src/common/filters/db/db-error-request.filter';
import { JwtGuard } from 'src/auth/jwt.guard';

@UseFilters(DbErrorServerFilter, DbErrorRequestFilter, DbErrorRequestFilter)
@UseGuards(JwtGuard)
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
  async findAll(@Query('limit') limit?: number, @Query('skip') skip?: number) {
    return this.userService.findAll({
      limit: limit ? Number(limit) : 10,
      skip: skip ? Number(skip) : 0,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.userService.findOne(id);
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
