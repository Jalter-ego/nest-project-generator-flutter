import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { cardList } from './lib/cardList';
import { IconNavegable, libraryIcons } from './lib/icons';
import { togglebuttons } from './lib/togglebuttons';
import { badge } from './lib/badge';
import { mapSidebarDrawer } from './lib/sidebar';

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
import 'package:demo_parcial/combobox.dart';
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
      [
        'checkbox',
        'switch',
        'radio',
        'timepicker',
        'slider',
        'listtilelist',
        'togglebuttons',
      ].includes(comp.type),
    );

    const sidebarComp = screen.components.find((comp: any) => comp.type === 'sidebar');
    const sidebarDrawer = sidebarComp ? mapSidebarDrawer(sidebarComp) : '';


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
      ${sidebarDrawer ? `drawer: ${sidebarDrawer},` : ''}
      body: SafeArea(
        child: Stack(
          children: [
            ${componentsCode}
          ],
        ),
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
      ${sidebarDrawer ? `drawer: ${sidebarDrawer},` : ''}
      body: SafeArea(
        child: Stack(
          children: [
            ${componentsCode}
          ],
        ),
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
    const onPressed = style.navigateTo
      ? `() => Navigator.pushNamed(context, '/${style.navigateTo}')`
      : '(){}';

    const positionWrapper = (child: string) =>
      `Positioned(
        left: ${x} * scaleFactor,
        top: ${y} * scaleFactor,
        child: ${child}
      )`;

    switch (type) {
      case 'button':
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
        return positionWrapper(IconNavegable('iconUser', onPressed));
      case 'iconSearch':
        return positionWrapper(IconNavegable('iconSearch', onPressed));
      case 'iconLock':
        return positionWrapper(
          `Icon(Icons.lock, size: 32 * scaleFactor, color: Colors.grey[800])`,
        );
      case 'iconMenuDeep':
        return positionWrapper(IconNavegable('iconMenuDeep', onPressed));
      case 'iconMenuDots':
        return positionWrapper(IconNavegable('iconMenuDots', onPressed));
      case 'iconHeart':
        return positionWrapper(
          `Icon(Icons.favorite_outline, size: 32 * scaleFactor, color: Colors.grey[800])`,
        );
      case 'iconMessage':
        return positionWrapper(IconNavegable('iconMessage', onPressed));
      case 'iconHeadphones':
        return positionWrapper(IconNavegable('iconHeadphones', onPressed));
      case 'iconLogin':
        return positionWrapper(IconNavegable('iconLogin', onPressed));
      case 'iconLogout':
        return positionWrapper(IconNavegable('iconLogout', onPressed));
      case 'iconAdd':
        return positionWrapper(
          `Icon(Icons.add, size: 32 * scaleFactor, color: Colors.grey[800])`,
        );
      case 'iconTag':
        return positionWrapper(
          `Icon(Icons.label, size: 32 * scaleFactor, color: Colors.grey[800])`,
        );
      case 'iconShare':
        return positionWrapper(
          `Icon(Icons.share, size: 32 * scaleFactor, color: Colors.grey[800])`,
        );
      case 'iconDotsHorizontal':
        return positionWrapper(
          `Icon(Icons.more_horiz, size: 32 * scaleFactor, color: Colors.grey[800])`,
        );
      case 'iconPlane':
        return positionWrapper(
          `Icon(Icons.send, size: 32 * scaleFactor, color: Colors.grey[800])`,
        );
      case 'iconImage':
        return positionWrapper(
          `Icon(Icons.image, size: 32 * scaleFactor, color: Colors.grey[800])`,
        );
      case 'iconText':
        return positionWrapper(
          `Icon(Icons.text_fields, size: 32 * scaleFactor, color: Colors.grey[800])`,
        );
      case 'iconEmoji':
        return positionWrapper(
          `Icon(Icons.emoji_emotions, size: 32 * scaleFactor, color: Colors.grey[800])`,
        );
      case 'iconMicrophone':
        return positionWrapper(
          `Icon(Icons.mic, size: 32 * scaleFactor, color: Colors.grey[800])`,
        );
      case 'iconArrowUp':
        return positionWrapper(IconNavegable('iconArrowUp', onPressed));
      case 'iconArrowDown':
        return positionWrapper(IconNavegable('iconArrowDown', onPressed));
      case 'iconArrowLeft':
        return positionWrapper(IconNavegable('iconArrowLeft', onPressed));
      case 'iconArrowRight':
        return positionWrapper(IconNavegable('iconArrowRight', onPressed));
      case 'iconArrowUpDown':
        return positionWrapper(IconNavegable('iconArrowUpDown', onPressed));
      case 'iconTrash':
        return positionWrapper(
          `Icon(Icons.delete, size: 32 * scaleFactor, color: Colors.grey[800])`,
        );
      case 'iconPencil':
        return positionWrapper(
          `Icon(Icons.edit, size: 32 * scaleFactor, color: Colors.grey[800])`,
        );
      case 'iconX':
        return positionWrapper(
          `Icon(Icons.cancel, size: 32 * scaleFactor, color: Colors.grey[800])`,
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
        const headers = table.header
          .map(
            (col: any) => `
          DataColumn(
            label: Text('${col.title || 'Column'}'),
          )`,
          )
          .join(',\n            ');
        const rows = table.data
          .map(
            (row: any) => `
          DataRow(
            cells: [
              DataCell(Text('${row.columan1 || ''}')),
              DataCell(Text('${row.columan2 || ''}')),
              DataCell(Text('${row.columan3 || ''}')),
            ],
          )`,
          )
          .join(',\n            ');
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
        const card = style.card || {
          title: 'Title',
          image: '',
          description: 'Description',
          price: 0,
        };
        const imageWidget =
          card.image && card.image.trim() !== ''
            ? `Image.network('${card.image}', fit: BoxFit.cover, height: 80 * scaleFactor, width: double.infinity, errorBuilder: (context, error, stackTrace) => Container(color: Colors.grey[300], height: 80 * scaleFactor),)`
            : `Container(color: Colors.grey[300], height: 80 * scaleFactor)`;
        return positionWrapper(`
SizedBox(
  width: 130 * scaleFactor,
  height: 170 * scaleFactor,
  child: Card(
    elevation: 4,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12 * scaleFactor),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.all(8 * scaleFactor),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ${imageWidget},
              SizedBox(height: 8 * scaleFactor),
              Text(
                '${card.title || 'Card Title'}',
                style: TextStyle(fontSize: 14 * scaleFactor, fontWeight: FontWeight.bold),
              ),
              Text(
                '${card.description || 'Card Description'}',
                style: TextStyle(fontSize: 12 * scaleFactor, color: Colors.grey[600]),
              ),
              Text(
                '${card.price || 0}',
                style: TextStyle(fontSize: 12 * scaleFactor, color: Colors.green),
              ),
            ],
          ),
        ),
      ],
    ),
  ),
)
        `);
      case 'image':
        const imageUrl =
          style.image && style.image.trim() !== ''
            ? style.image
            : 'https://via.placeholder.com/150'; // Fallback placeholder URL
        return positionWrapper(`
ClipRRect(
  borderRadius: BorderRadius.circular(${style.borderRadius || 0} * scaleFactor),
  child: Image.network(
    '${imageUrl}',
    width: ${style.width || 50} * scaleFactor,
    height: ${style.height || 50} * scaleFactor,
    fit: BoxFit.cover,
    errorBuilder: (context, error, stackTrace) => Container(
      width: ${style.width || 50} * scaleFactor,
      height: ${style.height || 50} * scaleFactor,
      color: Colors.grey[300],
    ),
  ),
)
        `);
      case 'label':
        return positionWrapper(`
Text(
  '${style.label || 'Label'}',
  style: TextStyle(
    fontSize: ${style.fontSize || 16} * scaleFactor,
    color: const Color(0xFF${style.colorFont?.substring(1) || '000000'}),
  ),
)
        `);
      case 'switch':
        return positionWrapper(`
StatefulBuilder(
  builder: (context, setSwitchState) {
    bool isChecked = ${style.checked ?? false};
    return Switch(
      value: isChecked,
      onChanged: (val) {
        setSwitchState(() {
          isChecked = val;
        });
      },
      activeColor: Colors.blue,
    );
  },
)
        `);
      case 'radio':
        return positionWrapper(`
StatefulBuilder(
  builder: (context, setRadioState) {
    bool isChecked = ${style.checked ?? false};
    return Radio(
      value: true,
      groupValue: isChecked,
      onChanged: (val) {
        setRadioState(() {
          isChecked = val as bool;
        });
      },
    );
  },
)
        `);
      case 'timepicker':
        return positionWrapper(`
StatefulBuilder(
  builder: (context, setTimeState) {
    // Use a local variable to persist the selected time across rebuilds
    var selectedTime = TimeOfDay.now();
    return StatefulBuilder(
      builder: (context, setInnerState) {
        return TextButton(
          onPressed: () async {
            final TimeOfDay? picked = await showTimePicker(
              context: context,
              initialTime: selectedTime,
            );
            if (picked != null && picked != selectedTime) {
              setInnerState(() {
                selectedTime = picked;
              });
            }
          },
          child: Builder(
            builder: (context) {
              return Text(
                '\${selectedTime.format(context)}',
                style: TextStyle(fontSize: 16 * scaleFactor),
              );
            },
          ),
        );
      },
    );
  },
)
        `);
      case 'chip':
        const chipBg = style.bg
          ? `const Color(0xFF${style.bg.substring(1)})`
          : 'Colors.grey[300]';
        const iconText = style.icon
          ? style.icon.substring(0, 2).toUpperCase()
          : 'AB';

        return positionWrapper(`
Chip(
  avatar: CircleAvatar(
    backgroundColor: ${chipBg},
    child: Container(
      padding: EdgeInsets.all(2),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.3),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        '${iconText}',
        style: TextStyle(color: Colors.white, fontSize: 12),
      ),
    ),
  ),
  label: Text(
    '${style.label || 'Label'}',
    style: TextStyle(color: Colors.white),
  ),
  backgroundColor: ${chipBg},
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(16 * scaleFactor),
  ),
)
  `);

      case 'circleavatar':
        const radius = (style.size || 50) / 2;
        return positionWrapper(`
ClipRRect(
  borderRadius: BorderRadius.circular(${radius} * scaleFactor),
  child: Image.network(
    '${style.image || 'https://via.placeholder.com/150'}',
    width: ${style.size || 50} * scaleFactor,
    height: ${style.size || 50} * scaleFactor,
    fit: BoxFit.cover,
    errorBuilder: (context, error, stackTrace) => Container(
      width: ${style.size || 50} * scaleFactor,
      height: ${style.size || 50} * scaleFactor,
      color: Colors.grey[300],
    ),
  ),
)
        `);
      case 'slider':
        const maxValue = style.max;
        const minValue = style.min;
        const value = style.value;
        return positionWrapper(`
StatefulBuilder(
                builder: (context, setSliderState) {
                  double sliderValue = ${value};
                  final double minValue = ${minValue};
                  final double maxValue = ${maxValue};
                  final int numberOfMarkers =
                      5; // Puedes ajustar cuántos marcadores quieres

                  List<double> markers =
                      List.generate(numberOfMarkers, (index) {
                    return minValue +
                        (maxValue - minValue) * index / (numberOfMarkers - 1);
                  });

                  return Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      SizedBox(
                        width: 300,
                        child: Slider(
                          value: sliderValue,
                          min: minValue,
                          max: maxValue,
                          divisions: (maxValue - minValue).toInt(),
                          label: sliderValue.toStringAsFixed(1),
                          onChanged: (value) {
                            setSliderState(() {
                              sliderValue = value;
                            });
                          },
                          activeColor: const Color(0xFF${style.color?.substring(1) || '000000'}),
                        ),
                      ),
                      SizedBox(
                        width: 250,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: markers.map((value) {
                            return Text(
                              value.toStringAsFixed(
                                  value.truncateToDouble() == value ? 0 : 1),
                              style: TextStyle(fontSize: 12),
                            );
                          }).toList(),
                        ),
                      ),
                    ],
                  );
                },
              ),
          `);
      case 'listtilelist':
        return positionWrapper(`
Column(
  children: [
    ${(style.list || [])
      .map(
        (item: any, index: number) => `
      ${cardList(item, index)}
    `,
      )
      .join('\n    ')}
  ]
)
            `);
      case 'togglebuttons':
        return positionWrapper(`
            ${togglebuttons(style)}
          `);
      case 'badge':
        return positionWrapper(`
            ${badge(style)}
          `);
      case 'combobox':
        const comboboxItems =
          style.combobox && Array.isArray(style.combobox)
            ? style.combobox
                .map(
                  (item: any) => `ComboboxItem(label: "${item.label || ''}")`,
                )
                .join(',\n                ')
            : '[]';
        return positionWrapper(`
ComboboxWidget(
  combobox: [${comboboxItems}],
  scaleFactor: scaleFactor,
)
      `);
      case 'sidebar':
      return positionWrapper(`
Builder(
    builder: (context) => IconButton(
      icon: const Icon(Icons.menu),
      onPressed: () {
        Scaffold.of(context).openDrawer();
      },
    ),
  ),
        `)
      default:
        return `// Unsupported component type: ${type}`;
    }
  }
}
