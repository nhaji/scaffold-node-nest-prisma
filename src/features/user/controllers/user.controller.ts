import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiQuery } from '@nestjs/swagger';
import { PaginationOptions } from 'src/core/data/pagination-options';
import { PaginatedResult } from 'src/core/data/paginated-result';
import { UserDto } from '../dto/user.dto';
import { UserDetailDto } from '../dto/user-detail.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDetailDto> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items to return per request' })
  @ApiQuery({ name: 'cursorId', required: false, type: Number, description: 'ID of the last item fetched, for cursor-based pagination' })
  @ApiQuery({ name: 'sort', required: false, type: String, example: '{"id": "asc"}', description: 'Sorting criteria, e.g., {"id": "asc"}' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for offset-based pagination' })
  async findAll(
    @Query() options: PaginationOptions,
  ): Promise<PaginatedResult<UserDto>> {
    return this.userService.findAll(options);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserDetailDto> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDetailDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.remove(id);
  }

  @Get('stats')
  async getStats() {
    return this.userService.getStats();
  }
}
