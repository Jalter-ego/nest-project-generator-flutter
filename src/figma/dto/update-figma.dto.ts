import { PartialType } from '@nestjs/mapped-types';
import { CreateFigmaDto } from './create-figma.dto';

export class UpdateFigmaDto extends PartialType(CreateFigmaDto) {}
