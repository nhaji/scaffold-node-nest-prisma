import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProfileDto } from '../dto/profile.dto';
import { Prisma } from 'src/generated/prisma/client';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class ProfileMapper {
    /**
     * Transforms a Prisma Profile model to a ProfileDto
     * @param profile - The profile entity from Prisma
     * @returns The transformed profile DTO
     */
    toProfileDto(profile: Prisma.ProfileGetPayload<{}> | null): ProfileDto | null {
        return plainToInstance(ProfileDto, profile);
    }

    /**
     * Transforms CreateProfileDto to Prisma ProfileCreateInput
     * @param dto - The DTO containing profile creation data
     * @returns The input object for Prisma create operation
     */
    toProfileCreateInput(createProfileDto: CreateProfileDto): Prisma.ProfileCreateWithoutUserInput {
        return { ...createProfileDto };
    }

    /**
     * Transforms UpdateProfileDto to Prisma ProfileUpdateInput
     * @param dto - The DTO containing profile update data
     * @returns The input object for Prisma update operation
     */
    toProfileUpdateInput(updateProfileDto: UpdateProfileDto): Prisma.ProfileUpdateWithoutUserInput {
        return { ...updateProfileDto };
    }
}