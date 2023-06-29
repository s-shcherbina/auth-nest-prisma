import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { options } from './config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { STRATEGIES } from './starategies';
import { GUARDS } from './guards';
// import { GUARDS } from './guargs';
// import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ...STRATEGIES, ...GUARDS],
  imports: [
    PassportModule,
    JwtModule.registerAsync(options()),
    UsersModule,
    // HttpModule,
  ],
})
export class AuthModule {}
