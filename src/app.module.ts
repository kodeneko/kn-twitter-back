import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { ActivityModule } from './activity/activity.module';
import { TrendingsModule } from './trendings/trendings.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:1234@localhost:3012/kn-twitty'),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PostsModule,
    ActivityModule,
    TrendingsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
