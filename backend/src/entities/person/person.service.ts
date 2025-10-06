import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePersonDto, UpdatePersonDto } from './person.model';

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  async create(createPersonDto: CreatePersonDto) {
    return this.prisma.person.create({
      data: {
        name: createPersonDto.name,
      },
    });
  }

  async findAll() {
    return this.prisma.person.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const person = await this.prisma.person.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!person || person.deletedAt) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    return person;
  }

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    const person = await this.findOne(id);
    
    return this.prisma.person.update({
      where: { id },
      data: {
        ...updatePersonDto,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: number) {
    const person = await this.findOne(id);
    
    return this.prisma.person.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
}
