import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CourtService } from './court.service';
import { CreateCourtDto, UpdateCourtDto, CreateCourtSchema, UpdateCourtSchema } from './court.model';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('courts')
export class CourtController {
  constructor(private readonly courtService: CourtService) {}

  @Post()
  create(@Body(new ZodValidationPipe(CreateCourtSchema)) createCourtDto: CreateCourtDto) {
    return this.courtService.create(createCourtDto);
  }

  @Get()
  findAll() {
    return this.courtService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courtService.findOne(id);
  }

  @Get('club/:clubId')
  findByClub(@Param('clubId') clubId: string) {
    return this.courtService.findByClub(clubId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCourtSchema)) updateCourtDto: UpdateCourtDto,
  ) {
    return this.courtService.update(id, updateCourtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courtService.remove(id);
  }
}
