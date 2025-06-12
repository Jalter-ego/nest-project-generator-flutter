import { libraryIcons } from "./icons";

export const mapSidebarDrawer = (comp: any): string => {
  const sidebar = comp.properties?.sidebar;
  if (!sidebar) return '';

  const itemsCode = (sidebar.items || [])
    .map((item: any) => {
      const label = item.item || '';
      const iconName = item.icon || '';
      const navigateTo = item.navigateTo;

      const iconCode = libraryIcons(iconName)

      const onTap = navigateTo
        ? `() => Navigator.pushNamed(context, '/${navigateTo}')`
        : '() {}';

      return `
ListTile(
  leading: ${iconCode},
  title: Text('${label}'),
  onTap: ${onTap},
)
      `.trim();
    })
    .join(',\n');

  const bgColor = sidebar.bg ? `Color(0xFF${sidebar.bg.substring(1)})` : 'Colors.white';

  return `
Drawer(
  child: Container(
    color: ${bgColor},
    child: ListView(
      padding: EdgeInsets.zero,
      children: [
        DrawerHeader(
          decoration: BoxDecoration(color: ${bgColor}),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('${sidebar.title}', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              Text('${sidebar.subtitle}', style: TextStyle(fontSize: 14)),
            ],
          ),
        ),
        ${itemsCode}
      ],
    ),
  ),
)
  `.trim();
}
