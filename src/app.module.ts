import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { ActivityModule } from './activity/activity.module';
import { TrendingModule } from './trending/trending.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

const DB_URL = process.env.DB_URL as string;

@Module({
  imports: [
    MongooseModule.forRoot(DB_URL),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PostsModule,
    ActivityModule,
    TrendingModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
