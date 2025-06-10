import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { FlutterGeneratorService } from './flutter.service';
import { Response } from 'express';
import * as JSZip from 'jszip';
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly flutterGeneratorService: FlutterGeneratorService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('flutter')
  async generateFlutterProject(@Body() data: any[], @Res() res: Response) {
    try {
      if (!data || data.length === 0) {
        return res.status(400).json({ error: 'Diseño vacío o inválido' });
      }

      // Generar main.dart
      const mainDartContent = this.flutterGeneratorService.generateMainDart(data);

      // Ruta del template (ajusta según tu estructura real)
      const templatePath = path.join(process.cwd(), 'src', 'demo_parcial');
      if (!fs.existsSync(templatePath)) {
        throw new Error(`La plantilla no existe en: ${templatePath}`);
      }

      // Crear ZIP
      const zip = new JSZip();
      const addFilesToZip = (dir: string, zipFolder: JSZip) => {
        const files = fs.readdirSync(dir);
        files.forEach((file) => {
          const fullPath = path.join(dir, file);
          if (fs.statSync(fullPath).isDirectory()) {
            const newFolder = zipFolder.folder(file);
            if (newFolder) addFilesToZip(fullPath, newFolder);
          } else {
            const fileContent = fs.readFileSync(fullPath, 'utf8');
            zipFolder.file(file, fileContent);
          }
        });
      };

      addFilesToZip(templatePath, zip);
      zip.file('lib/main.dart', mainDartContent);

      // Enviar ZIP
      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="flutter_project.zip"');
      res.send(zipBuffer);

    } catch (error) {
      console.error('Error en generateFlutterProject:', error);  // Log detallado
      res.status(500).json({ 
        error: 'Error al generar el proyecto',
        details: error.message 
      });
    }
  }
}
