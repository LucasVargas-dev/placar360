import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { LocalAuthGuard } from './guards/localAuth.guard';
import { ZodValidation } from '../../packages/common/decorators/zod-validation.decorator';
import { LoginSchema, RegisterSchema, LoginDto, RegisterDto } from './schemas/auth.schemas';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  @ZodValidation(LoginSchema)
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.authService.login(user);
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
