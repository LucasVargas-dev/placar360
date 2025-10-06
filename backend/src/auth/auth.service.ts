import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async register(email: string, password: string, name?: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Get default role (Player role)
    const defaultRole = await this.prisma.role.findFirst({
      where: { name: 'Player' },
    });

    if (!defaultRole) {
      throw new Error('Default role not found. Please seed the database with roles.');
    }

    // Create person name with timestamp to avoid conflicts
    const personName = name || `${email.split('@')[0]}_${Date.now()}`;

    // Use transaction to ensure data consistency
    const result = await this.prisma.$transaction(async (tx) => {
      // Create person record
      const person = await tx.person.create({
        data: {
          name: personName,
        },
      });

      // Create user record
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          cpf: '', // Adding required cpf field
          personId: person.id,
          roleId: defaultRole.id,
        },
        include: {
          person: true,
          role: true,
        },
      });

      return user;
    });

    const { password: _, ...userResult } = result;
    return userResult;
  }
}
