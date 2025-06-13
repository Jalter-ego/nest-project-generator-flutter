import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateFigmaDto } from './create-figma.dto';

export class UpdateFigmaDto extends PartialType(CreateFigmaDto) {
  @IsString()
  @IsNotEmpty()
  editKey: string;
}
