import { Module } from '@nestjs/common';
import { CourtService } from './court.service';
import { CourtController } from './court.controller';
import { CourtORM } from './court.orm';
import { CourtQueryService } from './court.query.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CourtController],
  providers: [CourtORM, CourtQueryService, CourtService],
  exports: [CourtService],
})
export class CourtModule {}
