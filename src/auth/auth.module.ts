import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtAuthService } from './jwt-auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TwitterService } from './twitter.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule), JwtModule.register({})],
  controllers: [AuthController],
  providers: [JwtAuthService, TwitterService],
  exports: [JwtAuthService],
})
export class AuthModule {}
