import { Module } from '@nestjs/common';
import { UserClubService } from './userClub.service';
import { UserClubController } from './userClub.controller';
import { UserClubORM } from './userClub.orm';
import { UserClubQueryService } from './userClub.query.service';

@Module({
  controllers: [UserClubController],
  providers: [UserClubORM, UserClubQueryService, UserClubService],
  exports: [UserClubService],
})
export class UserClubModule {}
