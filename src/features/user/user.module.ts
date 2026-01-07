import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserMapper } from './mappers/user.mapper';
import { ProfileMapper } from './mappers/profile.mapper';

@Module({
  controllers: [UserController],
  providers: [UserRepository, UserService, UserMapper, ProfileMapper],
  exports:[UserService, UserMapper]
})
export class UserModule {}
