import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { login: dto.login },
    });
    if (userExists) throw new ForbiddenException('Login already taken');

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: { ...dto, password: hashed },
    });

    return this.signToken(user.id, user.login, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { login: dto.login },
    });
    if (!user) throw new ForbiddenException('Invalid login or password');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new ForbiddenException('Invalid login or password');

    return this.signToken(user.id, user.login, user.role);
  }

  async signToken(userId: string, login: string, role: string) {
    const payload = { sub: userId, login, role };
    const token = await this.jwt.signAsync(payload);
    return {
      access_token: token,
      user: { id: userId, login, role },
    };
  }
}
