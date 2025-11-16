import { Module } from '@nestjs/common';
import { ClubService } from './club.service';
import { ClubController } from './club.controller';
import { ClubORM } from './club.orm';
import { ClubQueryService } from './club.query.service';

@Module({
  controllers: [ClubController],
  providers: [ClubORM, ClubQueryService, ClubService],
  exports: [ClubService],
})
export class ClubModule {}
