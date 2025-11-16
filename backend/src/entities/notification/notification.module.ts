import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationORM } from './notification.orm';
import { NotificationQueryService } from './notification.query.service';
import { NotificationSchedulerService } from './handle/notificationScheduler.service';
import { EmailService } from './handle/email.service';
import { WhatsAppService } from './handle/whatsapp.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [NotificationController],
  providers: [
    NotificationORM,
    NotificationQueryService,
    NotificationService,
    NotificationSchedulerService,
    EmailService,
    WhatsAppService,
  ],
  exports: [
    NotificationService,
    NotificationSchedulerService,
    EmailService,
    WhatsAppService,
  ],
})
export class NotificationModule {}
