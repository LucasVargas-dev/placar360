// import ORM from '../../../packages/default.orm.js';
// import { PrismaModel } from '../../../packages/utils/index.js';
// import { Injectable, Inject } from '@nestjs/common';
// import { PrismaService } from '../../prisma/prisma.service';
// import DefaultEntity from '@packages/defaultEntity.js';
// import { CourtEntity } from '../court/court.orm.js';
// // import { ClubSchedule } from '@prisma/client';

// // export type ClubScheduleEntity = ClubSchedule & DefaultEntity;

// @Injectable()
// export class ClubScheduleORM extends ORM<CourtEntity> {
// 	constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
// 		super();
// 		this.setPrismaClient(prisma);
// 	}

// 	getModelName(): PrismaModel {
// 		return 'clubSchedule';
// 	}

// 	isGeneral(): boolean {
// 		return false;
// 	}
// }



