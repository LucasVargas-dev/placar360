import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getStatus() {
    return {
      message: 'Placar360 API está funcionando! 🚀',
      status: 'online',
      version: '1.0.0',
      endpoints: {
        auth: {
          login: 'POST /api/auth/login',
          register: 'POST /api/auth/register',
        },
        users: 'GET /api/users',
        persons: 'GET /api/people',
        clubs: 'GET /api/clubs',
        courts: 'GET /api/courts',
        bookings: 'GET /api/bookings',
        tournaments: 'GET /api/tournaments',
        roles: 'GET /api/roles',
        permissions: 'GET /api/permissions',
      },
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
