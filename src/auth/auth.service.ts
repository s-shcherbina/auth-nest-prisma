import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tokens } from './interfaces';
import { Token, User } from '@prisma/client';
import { compareSync } from 'bcrypt';
import { v4 } from 'uuid';
import { add } from 'date-fns';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async refreshTokens(refreshToken: string, agent: string): Promise<Tokens> {
    const token = await this.prismaService.token.delete({
      where: { token: refreshToken },
    });
    if (!token || new Date(token.exp) < new Date())
      throw new UnauthorizedException();

    const user = await this.usersService.findOne(token.userId);
    return this.generateTokens(user, agent);
  }

  async register(dto: RegisterDto) {
    const user: User = await this.usersService
      .findOne(dto.email)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });
    if (user) {
      throw new ConflictException(
        'Пользователь с таким email уже зарегистрирован',
      );
    }
    return this.usersService.save(dto).catch((err) => {
      this.logger.error(err);
      return null;
    });
  }

  async login(dto: LoginDto, agent: string): Promise<Tokens> {
    const user: User = await this.usersService
      .findOne(dto.email)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });
    if (!user || !compareSync(dto.password, user.password))
      throw new UnauthorizedException('Не верный логин или пароль');
    return this.generateTokens(user, agent);
    // const accessToken =
    //   'Bearer ' +
    //   this.jwtService.sign({
    //     id: user.id,
    //     email: user.email,
    //     roles: user.roles,
    //   });
    // const refreshToken = await this.getRefreshToken(user.id);
    // return { accessToken, refreshToken };
  }

  deleteRefreshToken(token: string) {
    return this.prismaService.token.delete({ where: { token } });
  }

  private async getRefreshToken(userId: string, agent: string) {
    const token = await this.prismaService.token.findFirst({
      where: {
        userId,
        userAgent: agent,
      },
    });
    console.log(token);
    if (token) {
      return this.prismaService.token.update({
        where: { token: token.token },
        data: {
          token: v4(),
          exp: add(new Date(), { months: 1 }),
        },
      });
    } else {
      return this.prismaService.token.create({
        data: {
          token: v4(),
          exp: add(new Date(), { months: 1 }),
          userId,
          userAgent: agent,
        },
      });
    }
  }
  // return token;
  //   const token = _token?.token ?? null;
  //   const newToken = await this.prismaService.token.upsert({
  //     where: { token },
  //     update: {
  //       token: v4(),
  //       exp: add(new Date(), { months: 1 }),
  //     },
  //     create: {
  //       token: v4(),
  //       exp: add(new Date(), { months: 1 }),
  //       userId,
  //       userAgent: agent,
  //     },
  //   });
  //   return newToken;

  private async generateTokens(user: User, agent: string): Promise<Tokens> {
    const accessToken =
      'Bearer ' +
      this.jwtService.sign({
        id: user.id,
        email: user.email,
        roles: user.roles,
      });
    const refreshToken = await this.getRefreshToken(user.id, agent);
    return { accessToken, refreshToken };
  }
}
