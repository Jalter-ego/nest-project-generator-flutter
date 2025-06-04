import { Module } from '@nestjs/common';
import { FigmaService } from './figma.service';
import { FigmaController } from './figma.controller';
import { FigmaGateway } from './figma.gateway';

@Module({
  controllers: [FigmaController],
  providers: [FigmaService,FigmaGateway],
})
export class FigmaModule {}
