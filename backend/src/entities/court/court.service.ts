import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourtDto, UpdateCourtDto } from './court.model';

@Injectable()
export class CourtService {
  constructor(private prisma: PrismaService) {}

  async create(createCourtDto: CreateCourtDto) {
    // Check if club exists
    const club = await this.prisma.club.findUnique({
      where: { id: createCourtDto.clubId },
    });

    if (!club || club.deletedAt) {
      throw new NotFoundException(`Club with ID ${createCourtDto.clubId} not found`);
    }

    // Check if court name already exists in the same club
    const existingCourt = await this.prisma.court.findFirst({
      where: { 
        clubId: createCourtDto.clubId,
        name: createCourtDto.name,
        deletedAt: null,
      },
    });

    if (existingCourt) {
      throw new ConflictException('Court name already exists in this club');
    }

    return this.prisma.court.create({
      data: {
        clubId: createCourtDto.clubId,
        name: createCourtDto.name,
        sportType: createCourtDto.sportType ?? 'padel',
        surface: createCourtDto.surface,
        defaultSlotMinutes: createCourtDto.defaultSlotMinutes ?? 60,
        hourlyRate: createCourtDto.hourlyRate,
        isActive: createCourtDto.isActive ?? true,
      },
      include: {
        club: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.court.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        club: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { club: { name: 'asc' } },
        { name: 'asc' },
      ],
    });
  }

  async findOne(id: string) {
    const court = await this.prisma.court.findUnique({
      where: { id },
      include: {
        club: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!court || court.deletedAt) {
      throw new NotFoundException(`Court with ID ${id} not found`);
    }

    return court;
  }

  async findByClub(clubId: string) {
    // Check if club exists
    const club = await this.prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club || club.deletedAt) {
      throw new NotFoundException(`Club with ID ${clubId} not found`);
    }

    return this.prisma.court.findMany({
      where: {
        clubId,
        deletedAt: null,
      },
      include: {
        club: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async update(id: string, updateCourtDto: UpdateCourtDto) {
    const court = await this.findOne(id);
    
    // Check if name is being updated and if it already exists in the same club
    if (updateCourtDto.name && updateCourtDto.name !== court.name) {
      const existingCourt = await this.prisma.court.findFirst({
        where: { 
          clubId: court.clubId,
          name: updateCourtDto.name,
          deletedAt: null,
          NOT: { id },
        },
      });

      if (existingCourt) {
        throw new ConflictException('Court name already exists in this club');
      }
    }
    
    return this.prisma.court.update({
      where: { id },
      data: {
        ...updateCourtDto,
        updatedAt: new Date(),
      },
      include: {
        club: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const court = await this.findOne(id);
    
    return this.prisma.court.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
}
