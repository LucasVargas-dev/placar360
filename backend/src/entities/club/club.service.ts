import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClubDto, UpdateClubDto } from './club.model';

@Injectable()
export class ClubService {
  constructor(private prisma: PrismaService) {}

  async create(createClubDto: CreateClubDto) {
    // Check if club name already exists
    const existingClub = await this.prisma.club.findFirst({
      where: { 
        name: createClubDto.name,
        deletedAt: null,
      },
    });

    if (existingClub) {
      throw new ConflictException('Club name already exists');
    }

    return this.prisma.club.create({
      data: {
        createdBy: createClubDto.createdBy,
        name: createClubDto.name,
        description: createClubDto.description,
        phone: createClubDto.phone,
        email: createClubDto.email,
        addressLine: createClubDto.addressLine,
        city: createClubDto.city,
        state: createClubDto.state,
        timezone: createClubDto.timezone,
        openTime: createClubDto.openTime,
        closeTime: createClubDto.closeTime,
        isActive: createClubDto.isActive ?? true,
      },
      include: {
        courts: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            sportType: true,
            isActive: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.club.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        courts: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            sportType: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const club = await this.prisma.club.findUnique({
      where: { id },
      include: {
        courts: {
          where: {
            deletedAt: null,
          },
        },
      },
    });

    if (!club || club.deletedAt) {
      throw new NotFoundException(`Club with ID ${id} not found`);
    }

    return club;
  }

  async update(id: string, updateClubDto: UpdateClubDto) {
    const club = await this.findOne(id);
    
    // Check if name is being updated and if it already exists
    if (updateClubDto.name && updateClubDto.name !== club.name) {
      const existingClub = await this.prisma.club.findFirst({
        where: { 
          name: updateClubDto.name,
          deletedAt: null,
          NOT: { id },
        },
      });

      if (existingClub) {
        throw new ConflictException('Club name already exists');
      }
    }
    
    return this.prisma.club.update({
      where: { id },
      data: {
        ...updateClubDto,
        updatedAt: new Date(),
      },
      include: {
        courts: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const club = await this.findOne(id);
    
    return this.prisma.club.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async getCourts(id: string) {
    const club = await this.findOne(id);
    
    return this.prisma.court.findMany({
      where: {
        clubId: id,
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
