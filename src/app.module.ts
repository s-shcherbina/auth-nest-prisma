import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
