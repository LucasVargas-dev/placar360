import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ClubHasTournamentController } from './clubHasTournament.controller';
import { ClubHasTournamentService } from './clubHasTournament.service.js';

@Module({
	imports: [PrismaModule],
	controllers: [ClubHasTournamentController],
	providers: [ClubHasTournamentService],
	exports: [ClubHasTournamentService],
})
export class ClubHasTournamentModule {}



