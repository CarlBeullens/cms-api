import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [PrismaModule, JwtModule, PassportModule],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule],
  controllers: [AuthController]
})
export class AuthModule {}
