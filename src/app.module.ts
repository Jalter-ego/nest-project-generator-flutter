import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FigmaModule } from './figma/figma.module';
import { PrismaModule } from './prisma/prisma.module';
import { FlutterGeneratorService } from './flutter.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [FigmaModule,PrismaModule,AuthModule],
  controllers: [AppController],
  providers: [AppService,FlutterGeneratorService],
})
export class AppModule {}
