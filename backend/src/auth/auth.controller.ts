import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ZodValidation } from '../common/decorators/zod-validation.decorator';
import { LoginSchema, RegisterSchema, LoginDto, RegisterDto } from './schemas/auth.schemas';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ZodValidation(LoginSchema)
  async login(@Body() body: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ZodValidation(RegisterSchema)
  async register(@Body() body: RegisterDto) {
    const user = await this.authService.register(
      body.email,
      body.password,
      body.name,
    );
    return { message: 'Usuário criado com sucesso', user };
  }
}
