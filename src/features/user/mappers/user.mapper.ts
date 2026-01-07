import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaginatedResult } from 'src/core/data/paginated-result';
import { mapPaginatedResultData } from 'src/core/data/helpers/pagination.helper';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDto } from '../dto/user.dto';
import { UserDetailDto } from '../dto/user-detail.dto';
import { UserDetailResult, UserListResult } from '../repositories/user.repository';
import { ProfileMapper } from './profile.mapper';
import { Prisma } from 'src/generated/prisma/client';
import { UserNestedResult } from 'src/features/shared/constants/select.constants';

/**
 * Mapper for transforming between User domain objects and DTOs.
 * Handles the conversion between Prisma models and API response formats.
 */
@Injectable()
export class UserMapper {
  /**
   * Creates an instance of UserMapper.
   * @param profileMapper - The profile mapper for handling profile-related transformations
   */
  constructor(private readonly profileMapper: ProfileMapper) { }

  /**
   * Transforms a UserListResult to a UserDto.
   * @param userEntity - The user entity from the repository
   * @returns A simplified user representation for listing
   */
  toUserDto(userEntity: UserListResult): UserDto {
    return plainToInstance(UserDto, {
      ...userEntity,
      profile: userEntity.profile ? {
        avatar: userEntity.profile.avatar
      } : null,
    });
  }

  /**
* Transforms a single User domain object to UserDto.
* 
* Converts Prisma User model to minimal DTO format with only essential fields.
* Optimized for performance when only basic user information is needed.
* 
* @param user - The User domain object from Prisma with minimal select
* @returns The transformed UserDto with only essential fields
*/
  toUserNestedDto(user: UserNestedResult): UserDto {
    return plainToInstance(UserDto, user);
  }

  /**
  * Transforms a UserDetailResult to a UserDetailDto.
  * @param userEntity - The detailed user entity from the repository
  * @returns A comprehensive user representation with profile details
  */
  toUserDetailDto(userEntity: UserDetailResult): UserDetailDto {
    return plainToInstance(UserDetailDto, {
      ...userEntity,
      profile: userEntity.profile ?
        this.profileMapper.toProfileDto(userEntity.profile) : null,
    });
  }

  /**
   * Transforms a paginated list of users to a paginated list of UserListDto.
   * @param paginatedResult - The paginated result from the repository
   * @returns A paginated result of user list items
   */
  toPaginatedUserListDto(
    paginatedResult: PaginatedResult<UserListResult>,
  ): PaginatedResult<UserDto> {
    return mapPaginatedResultData(
      paginatedResult,
      (item) => this.toUserDto(item)
    );
  }

  /**
   * Transforms a CreateUserDto to a Prisma UserCreateInput.
   * @param userDto - The DTO containing user creation data
   * @param hashedPassword - The pre-hashed password
   * @returns Input for creating a user in the database
   */
  toCreateUserInput(
    userDto: CreateUserDto,
    hashedPassword: string,
  ): Prisma.UserCreateInput {
    const { profile, ...userData } = userDto;
    const userCreateInput: Prisma.UserCreateInput = {
      ...userData,
      password: hashedPassword,
    };

    if (profile) {
      userCreateInput.profile = {
        create: this.profileMapper.toProfileCreateInput(profile)
      };
    }

    return userCreateInput;
  }

  /**
  * Transforms an UpdateUserDto to a Prisma UserUpdateInput.
  * Handles partial updates and delegates profile updates to ProfileMapper.
  * @param userDto - The DTO containing user update data
  * @returns Input for updating a user in the database
  */
  toUpdateUserInput(userDto: UpdateUserDto): Prisma.UserUpdateInput {
    const { profile, ...userData } = userDto;
    const userUpdateInput: Prisma.UserUpdateInput = {
      ...userData,
    };

    if (profile) {
      userUpdateInput.profile = {
        update: this.profileMapper.toProfileUpdateInput(profile)
      };
    }

    return userUpdateInput;
  }
}