import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FigmaModule } from './figma/figma.module';
import { PrismaModule } from './prisma/prisma.module';
import { FlutterGeneratorService } from './flutter.service';

@Module({
  imports: [FigmaModule,PrismaModule],
  controllers: [AppController],
  providers: [AppService,FlutterGeneratorService],
})
export class AppModule {}
