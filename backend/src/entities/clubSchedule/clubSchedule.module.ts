import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ClubScheduleController } from './clubSchedule.controller';
import { ClubScheduleService } from './clubSchedule.service';
import { BookingModule } from '../booking/booking.module';

@Module({
	imports: [PrismaModule, BookingModule],
	controllers: [ClubScheduleController],
	providers: [ClubScheduleService],
	exports: [ClubScheduleService],
})
export class ClubScheduleModule {}



