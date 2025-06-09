import { Injectable } from '@nestjs/common';
import { SignInDto } from './signInDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.prismaService.user.findFirst({
        where:{
            email: signInDto.email
        }
    });
    if (!user) {
      await this.prismaService.user.create({
        data: signInDto
      });
    }
    const userFind = await this.prismaService.user.findFirst({
        where:{
            email: signInDto.email
        }
    });

    const payload = { user: userFind };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}