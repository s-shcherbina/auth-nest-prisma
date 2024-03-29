// import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { User } from '@prisma/client';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { UsersService } from 'src/users/users.service';
// import { JwtPayload } from '../interfaces';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   private readonly logger = new Logger(JwtStrategy.name);
//   constructor(
//     private readonly configService: ConfigService,
//     private readonly userService: UsersService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.get('JWT_SECRET'),
//     });
//   }

//   async validate(payload: JwtPayload) {
//     const user: User = await this.userService
//       .findOne(payload.id)
//       .catch((err) => {
//         this.logger.error(err);
//         return null;
//       });
//     // if (!user || user.isBlocked) {
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return payload;
//   }
// }

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    return { ...payload };
  }
}
