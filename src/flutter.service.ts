import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FlutterGeneratorService {
  private readonly DESIGN_WIDTH = 300;

  generateFlutterProject(design: any) {
    const projectPath = path.join(__dirname, '../../../generated_project');
    if (!fs.existsSync(projectPath))
      fs.mkdirSync(projectPath, { recursive: true });

    const libPath = path.join(projectPath, 'lib');
    if (!fs.existsSync(libPath)) fs.mkdirSync(libPath, { recursive: true });

    const mainContent = this.generateMainDart(design);
    fs.writeFileSync(path.join(libPath, 'main.dart'), mainContent);

    const pubspecContent = this.generatePubspec();
    fs.writeFileSync(path.join(projectPath, 'pubspec.yaml'), pubspecContent);
  }

  generatePubspec(): string {
    return `
name: generated_app
description: A Flutter app generated from a UI design.
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter

dev_dependencies:
  flutter_test:
    sdk: flutter

flutter:
  uses-material-design: true
`;
  }

  generateMainDart(design: any[]): string {
    const routes = design
      .map((screen) => {
        const route = screen.id.startsWith('/') ? screen.id : `/${screen.id}`;
        const className = this.toClassName(screen.id);
        return `'${route}': (context) => ${className}Screen(),`;
      })
      .join('\n        ');

    const screensCode = design
      .map((screen) => this.generateScreen(screen))
      .join('\n\n');

    const initialRoute = design[0].id.startsWith('/')
      ? design[0].id
      : `/${design[0].id}`;

    return `
import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Generated App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        scaffoldBackgroundColor: Colors.white,
      ),
      initialRoute: '${initialRoute}',
      routes: {
        ${routes}
      },
      debugShowCheckedModeBanner: false,
    );
  }
}

${screensCode}
`.trim();
  }

  toClassName(id: string): string {
    if (id.toLowerCase() === 'home') {
      return 'Home';
    }
    const cleanedId = id
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/^(\d+)/, 'Screen$1');
    return cleanedId.charAt(0).toUpperCase() + cleanedId.slice(1);
  }

  generateScreen(screen: any): string {
    const className = this.toClassName(screen.id);
    const componentsCode = screen.components
      .map((comp: any) => this.mapComponent(comp))
      .join(',\n          ');

    const hasStatefulComponents = screen.components.some((comp: any) =>
      ['checkbox'].includes(comp.type),
    );

    if (hasStatefulComponents) {
      return `
class ${className}Screen extends StatefulWidget {
  const ${className}Screen({super.key});

  @override
  State<${className}Screen> createState() => _${className}ScreenState();
}

class _${className}ScreenState extends State<${className}Screen> {
  @override
  Widget build(BuildContext context) {
    final scaleFactor = MediaQuery.of(context).size.width / ${this.DESIGN_WIDTH};
    return Scaffold(
      body: Stack(
        children: [
          ${componentsCode}
        ],
      ),
    );
  }
}
`.trim();
    } else {
      return `
class ${className}Screen extends StatelessWidget {
  const ${className}Screen({super.key});

  @override
  Widget build(BuildContext context) {
    final scaleFactor = MediaQuery.of(context).size.width / ${this.DESIGN_WIDTH};
    return Scaffold(
      body: Stack(
        children: [
          ${componentsCode}
        ],
      ),
    );
  }
}
`.trim();
    }
  }

  mapComponent(comp: any): string {
    const { x, y, properties, type } = comp;
    const style = properties || {};

    const positionWrapper = (child: string) =>
      `Positioned(
        left: ${x} * scaleFactor,
        top: ${y} * scaleFactor,
        child: ${child}
      )`;

    switch (type) {
      case 'button':
        const onPressed = style.navigateTo
          ? `() => Navigator.pushNamed(context, '/${style.navigateTo}')`
          : 'null';
        return positionWrapper(`
SizedBox(
  width: ${style.width || 128} * scaleFactor,
  height: ${style.height || 32} * scaleFactor,
  child: ElevatedButton(
    style: ElevatedButton.styleFrom(
      backgroundColor: const Color(0xFF${style.bg?.substring(1) || '2196F3'}),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${style.borderRadius || 8} * scaleFactor),
      ),
    ),
    onPressed: ${onPressed},
    child: Text(
      '${style.label || 'Botón'}',
      style: TextStyle(fontSize: ${style.fontSize || 14} * scaleFactor, color: Colors.white),
    ),
  ),
)
        `);
      case 'textfield':
        return positionWrapper(`
SizedBox(
  width: ${style.width || 200} * scaleFactor,
  height: ${style.height || 40} * scaleFactor,
  child: TextField(
    decoration: InputDecoration(
      hintText: '${style.placeholder || ''}',
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(${style.borderRadius || 8} * scaleFactor),
      ),
      contentPadding: EdgeInsets.symmetric(horizontal: 12 * scaleFactor, vertical: 8 * scaleFactor),
    ),
    style: TextStyle(fontSize: 16 * scaleFactor),
  ),
)
        `);
      case 'checkbox':
        return positionWrapper(`
StatefulBuilder(
  builder: (context, setCheckboxState) {
    bool isChecked = ${style.checked ?? false};
    return Checkbox(
      value: isChecked,
      onChanged: (val) {
        setCheckboxState(() {
          isChecked = val!;
        });
      },
      visualDensity: VisualDensity(
        horizontal: scaleFactor - 1,
        vertical: scaleFactor - 1,
      ),
    );
  },
)
        `);
      case 'iconUser':
        return positionWrapper(
          `Icon(Icons.person, size: 32 * scaleFactor, color: Colors.grey[800])`,
        );
      case 'iconSearch':
        return positionWrapper(
          `Icon(Icons.search, size: 32 * scaleFactor, color: Colors.grey[800])`,
        );
      case 'iconLock':
        return positionWrapper(
          `Icon(Icons.lock, size: 32 * scaleFactor, color: Colors.grey[800])`,
        );
      case 'iconMenuDeep':
        return positionWrapper(
          `Icon(Icons.menu, size: 32 * scaleFactor, color: Colors.grey[800])`,
        );
      case 'container':
        return positionWrapper(`
Container(
  width: ${style.width || 100} * scaleFactor,
  height: ${style.height || 100} * scaleFactor,
  decoration: BoxDecoration(
    color: const Color(0xFF${style.bg?.substring(1) || 'ffffff'}),
    borderRadius: BorderRadius.circular(${style.borderRadius || 0} * scaleFactor),
  ),
)
        `);
      case 'calendar':
        return positionWrapper(`
SizedBox(
  width: 280 * scaleFactor, // Default width based on typical calendar size
  height: 300 * scaleFactor, // Default height for a calendar
  child: TableCalendar(
    firstDay: DateTime.utc(2020, 1, 1),
    lastDay: DateTime.utc(2030, 12, 31),
    focusedDay: DateTime.now(),
    calendarStyle: CalendarStyle(
      todayDecoration: BoxDecoration(
        color: Colors.blue,
        shape: BoxShape.circle,
      ),
    ),
  ),
)
       `);
      case 'table':
        const table = style.table || { header: [], data: [] };
        const headers = table.header.map((col: any) => `
          DataColumn(
            label: Text('${col.title || 'Column'}'),
          )`).join(',\n            ');
        const rows = table.data.map((row: any) => `
          DataRow(
            cells: [
              DataCell(Text('${row.columan1 || ''}')),
              DataCell(Text('${row.columan2 || ''}')),
              DataCell(Text('${row.columan3 || ''}')),
            ],
          )`).join(',\n            ');
        return positionWrapper(`
SizedBox(
  width: 280 * scaleFactor, // Adjust width based on content
  child: SingleChildScrollView(
    scrollDirection: Axis.horizontal,
    child: DataTable(
      columns: [
        ${headers}
      ],
      rows: [
        ${rows}
      ],
      border: TableBorder.all(color: Colors.grey[300]!),
      dataRowHeight: 40 * scaleFactor,
      headingRowHeight: 48 * scaleFactor,
      columnSpacing: 20 * scaleFactor,
    ),
  ),
)
        `);
      case 'card':
        const card = style.card || { title: 'Title', image: '', description: 'Description', price: 0 };
        const imageWidget = card.image && card.image.trim() !== ''
          ? `Image.network('${card.image}', fit: BoxFit.cover, height: 80 * scaleFactor, width: double.infinity, errorBuilder: (context, error, stackTrace) => Container(color: Colors.grey[300], height: 80 * scaleFactor),)`
          : `Container(color: Colors.grey[300], height: 80 * scaleFactor)`;
        return positionWrapper(`
SizedBox(
  width: 120 * scaleFactor,
  height: 200 * scaleFactor,
  child: Card(
    elevation: 4,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12 * scaleFactor),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ${imageWidget},
        Padding(
          padding: EdgeInsets.all(8 * scaleFactor),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '${card.title || 'Card Title'}',
                style: TextStyle(fontSize: 16 * scaleFactor, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 4 * scaleFactor),
              Text(
                '${card.description || 'Card Description'}',
                style: TextStyle(fontSize: 14 * scaleFactor, color: Colors.grey[600]),
              ),
              SizedBox(height: 8 * scaleFactor),
              Text(
                '${card.price || 0}',
                style: TextStyle(fontSize: 16 * scaleFactor, color: Colors.green),
              ),
            ],
          ),
        ),
      ],
    ),
  ),
)
        `);
      default:
        return `// Unsupported component type: ${type}`;
    }
  }
}
