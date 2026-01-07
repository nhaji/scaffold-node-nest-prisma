// src/features/user/services/user.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PaginationOptions } from 'src/core/data/pagination-options';
import { PaginatedResult } from 'src/core/data/paginated-result';
import { UserRepository } from '../repositories/user.repository';
import { UserMapper } from '../mappers/user.mapper';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDto } from '../dto/user.dto';
import { UserDetailDto } from '../dto/user-detail.dto';

/**
 * Service responsible for user management operations.
 * Handles business logic for user creation, retrieval, updates, and deletion.
 * Uses UserRepository for data access and UserMapper for DTO transformations.
 */
@Injectable()
export class UserService {
  /**
   * Creates an instance of UserService.
   * @param userRepository - The repository handling user data operations
   * @param userMapper - The mapper for transforming between DTOs and entities
   */
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}

  /**
   * Creates a new user with the provided data.
   * @param createUserDto - The user creation data
   * @returns The created user's details
   * @throws ConflictException if a user with the email already exists
   */
  async create(createUserDto: CreateUserDto): Promise<UserDetailDto> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const userToCreate = this.userMapper.toCreateUserInput(
      createUserDto,
      hashedPassword,
    );
    
    const user = await this.userRepository.create(userToCreate);
    return this.userMapper.toUserDetailDto(user);
  }

  /**
   * Retrieves a paginated list of users.
   * @param options - Pagination options including page, limit, and sorting
   * @returns Paginated list of users with metadata
   */
  async findAll(options: PaginationOptions): Promise<PaginatedResult<UserDto>> {
    const rawPaginatedUsers = await this.userRepository.findMany(options);
    return this.userMapper.toPaginatedUserListDto(rawPaginatedUsers);
  }

  /**
   * Retrieves a single user by ID.
   * @param id - The ID of the user to retrieve
   * @returns The requested user's details
   * @throws NotFoundException if no user exists with the provided ID
   */
  async findOne(id: number): Promise<UserDetailDto> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.userMapper.toUserDetailDto(user);
  }

  /**
   * Updates an existing user's information.
   * @param id - The ID of the user to update
   * @param updateUserDto - The data to update
   * @returns The updated user's details
   * @throws NotFoundException if no user exists with the provided ID
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDetailDto> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Use the mapper to convert DTO to update input
    const updateInput = this.userMapper.toUpdateUserInput(updateUserDto);
    
     // Only include password in the update if it's provided
    if (updateUserDto.password) {
        updateInput.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.userRepository.update(id, updateInput);
    return this.userMapper.toUserDetailDto(updatedUser);
}

  /**
   * Removes a user from the system.
   * @param id - The ID of the user to remove
   * @throws NotFoundException if no user exists with the provided ID
   */
  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.delete(id);
  }

  /**
   * Retrieves user statistics.
   * @returns User statistics
   */
  async getStats(): Promise<any> {
    return this.userRepository.getUserStats();
  }
}