import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { FigmaService } from './figma.service';
import { CreateFigmaDto } from './dto/create-figma.dto';
import { UpdateFigmaDto } from './dto/update-figma.dto';

@Controller('figma')
export class FigmaController {
  constructor(private readonly figmaService: FigmaService) {}

  @Post()
  create(@Body() createFigmaDto: CreateFigmaDto) {
    return this.figmaService.create(createFigmaDto);
  }

  @Get()
  findAll() {
    return this.figmaService.findAll();
  }

  @Get('user/:id')
  findAllByUser(@Param('id') id:string) {
    return this.figmaService.findAllByUser(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.figmaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFigmaDto: UpdateFigmaDto) {
    return this.figmaService.update(id, updateFigmaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.figmaService.remove(id);
  }
}
