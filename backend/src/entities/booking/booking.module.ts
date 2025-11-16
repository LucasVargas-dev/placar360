import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { BookingORM } from './booking.orm';
import { BookingQueryService } from './booking.query.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BookingController],
  providers: [BookingORM, BookingQueryService, BookingService],
  exports: [BookingService],
})
export class BookingModule {}
