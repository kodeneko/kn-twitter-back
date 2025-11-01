import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { WoeidController } from './woeid.controller';
import { Woeid, WoeidSchema } from './schema/woeid.schema';
import { WoeidService } from './woeid.service';
import { TrendingsService } from './trendings.service';
import { TrendingsController } from './trendings.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Woeid.name, schema: WoeidSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [WoeidController, TrendingsController],
  providers: [WoeidService, TrendingsService],
  exports: [],
})
export class TrendingsModule {}
