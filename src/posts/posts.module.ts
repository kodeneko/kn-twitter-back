import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, AuthModule],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
