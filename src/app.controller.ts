import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { FlutterGeneratorService } from './flutter.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly flutterGeneratorService: FlutterGeneratorService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('flutter')
  generateFlutterProject(@Body() data:any[]) {
    return this.flutterGeneratorService.generateMainDart(data);
  }
}
