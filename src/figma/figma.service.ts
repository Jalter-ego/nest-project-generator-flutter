import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFigmaDto } from './dto/create-figma.dto';
import { UpdateFigmaDto } from './dto/update-figma.dto';

@Injectable()
export class FigmaService {
  constructor(private prismaService: PrismaService) { }

  async create(createFigmaDto: CreateFigmaDto) {
    return this.prismaService.project.create({
      data: {
        name: createFigmaDto.name,
        userId: createFigmaDto.userId,
        editKey: crypto.randomUUID(),
        screens: createFigmaDto.screens
          ? {
            create: createFigmaDto.screens.map((screen) => ({
              id: screen.id,
              name: screen.name,
              components: {
                create: screen.components.map((component) => ({
                  id: component.id,
                  type: component.type,
                  x: component.x,
                  y: component.y,
                  properties: component.properties || {},
                })),
              },
            })),
          }
          : undefined,
      },
      include: {
        screens: {
          include: {
            components: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prismaService.project.findMany({
      include: {
        screens: {
          include: {
            components: true,
          },
        },
      },
    });
  }

  async findAllByUser(id: string) {
    return this.prismaService.project.findMany({
      where: {
        userId: id,
      },
      include: {
        screens: {
          include: {
            components: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const project = await this.prismaService.project.findUnique({
      where: { id },
      include: {
        screens: {
          include: {
            components: true,
          },
        },
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  }

  async update(id: string, updateFigmaDto: UpdateFigmaDto) {
    console.log(updateFigmaDto);

    const existingProject = await this.prismaService.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      throw new Error('Project not found or not authorized');
    }

    if (updateFigmaDto.editKey !== existingProject.editKey) {
      throw new Error('Unauthorized: Invalid edit key');
    }

    // Eliminar componentes (por si acaso)
    await this.prismaService.component.deleteMany({
      where: {
        screen: {
          projectId: id,
        },
      },
    });

    // Eliminar pantallas
    await this.prismaService.screen.deleteMany({
      where: {
        projectId: id,
      },
    });

    // Actualizar el proyecto con las nuevas pantallas y componentes
    return this.prismaService.project.update({
      where: { id },
      data: {
        name: updateFigmaDto.name,
        screens: updateFigmaDto.screens
          ? {
            create: updateFigmaDto.screens.map((screen) => ({
              name: screen.name,
              components: {
                create: screen.components.map((component) => ({
                  type: component.type,
                  x: component.x,
                  y: component.y,
                  properties: component.properties || {},
                })),
              },
            })),
          }
          : undefined,
      },
      include: {
        screens: {
          include: {
            components: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const existingProject = await this.prismaService.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      throw new Error('Project not found or not authorized');
    }

    await this.prismaService.project.delete({
      where: { id },
    });

    return { message: 'Project deleted successfully' };
  }
}
