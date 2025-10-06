import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClubService } from './club.service';
import { CreateClubDto, UpdateClubDto, CreateClubSchema, UpdateClubSchema } from './club.model';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('clubs')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Post()
  create(@Body(new ZodValidationPipe(CreateClubSchema)) createClubDto: CreateClubDto) {
    return this.clubService.create(createClubDto);
  }

  @Get()
  findAll() {
    return this.clubService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubService.findOne(id);
  }

  @Get(':id/courts')
  getCourts(@Param('id') id: string) {
    return this.clubService.getCourts(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateClubSchema)) updateClubDto: UpdateClubDto,
  ) {
    return this.clubService.update(id, updateClubDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clubService.remove(id);
  }
}
