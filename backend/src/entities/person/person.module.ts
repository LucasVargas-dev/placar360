import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { PersonORM } from './person.orm';
import { PersonQueryService } from './person.query.service';

@Module({
  controllers: [PersonController],
  providers: [PersonORM, PersonQueryService, PersonService],
  exports: [PersonService],
})
export class PersonModule {}
