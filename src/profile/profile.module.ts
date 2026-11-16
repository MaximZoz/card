import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProfileRepository } from './profile.repository';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [ProfileRepository, ProfileService, ProfileResolver],
})
export class ProfileModule {}
