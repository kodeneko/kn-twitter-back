import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtAuthService } from './jwt-auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TwitterService } from './twitter.service';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [JwtAuthService, TwitterService],
  exports: [JwtAuthService],
})
export class AuthModule {}
