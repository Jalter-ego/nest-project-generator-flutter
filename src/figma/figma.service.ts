import { Injectable } from '@nestjs/common';
import { CreateFigmaDto } from './dto/create-figma.dto';
import { UpdateFigmaDto } from './dto/update-figma.dto';

@Injectable()
export class FigmaService {
  create(createFigmaDto: CreateFigmaDto) {
    return 'This action adds a new figma';
  }

  findAll() {
    return `This action returns all figma`;
  }

  findOne(id: number) {
    return `This action returns a #${id} figma`;
  }

  update(id: number, updateFigmaDto: UpdateFigmaDto) {
    return `This action updates a #${id} figma`;
  }

  remove(id: number) {
    return `This action removes a #${id} figma`;
  }
}
