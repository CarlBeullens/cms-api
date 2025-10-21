import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthResponseDto } from './dto/auth-response-dto';
import { LoginDto } from './dto/login-dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register-dto';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  public async register(registerDto: RegisterDto) : Promise<AuthResponseDto> {

    const { email, password, name } = registerDto;
    
    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const saltRounds = this.configService.get<number>('BCRYPT_ROUNDS') ?? 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.prisma.user.create({
      data: { email: email, password: hashedPassword, name: name }
    });

    const token = await this.generateToken(user.id, user.email);
    
    return { 
      accessToken: token, 
      user: { id: user.id, email: user.email, name: user.name }
    }
  }

  public async login(loginDto: LoginDto) : Promise<AuthResponseDto> {

    const { email, password } = loginDto;
    
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateToken(user.id, user.email);

    return {
      accessToken: token,
      user: { id: user.id, email: user.email, name: user.name }
    }
  }
  
  /**
   * Validate user from JWT payload
   * Returns user without password field
   */
  public async validateUserFromJwt(userId: string) : Promise<Omit<User, 'password'>> {

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true, password: false}
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  private async generateToken(userId: string, email: string) : Promise<string> {

    const payload = { sub: userId, email: email };

    // Secret and expiresIn are now configured at module level in auth.module.ts
    const token = await this.jwtService.signAsync(payload);

    return token;
  }






}
