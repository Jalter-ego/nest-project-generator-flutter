import 'package:flutter/material.dart';

class ComboboxItem {
  final String label;

  ComboboxItem({required this.label});
}

class ComboboxWidget extends StatefulWidget {
  final List<ComboboxItem> combobox;
  final double scaleFactor;

  const ComboboxWidget({
    super.key,
    required this.combobox,
    required this.scaleFactor,
  });

  @override
  State<ComboboxWidget> createState() => _ComboboxWidgetState();
}

class _ComboboxWidgetState extends State<ComboboxWidget> {
  String? _selectedValue;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 270 * widget.scaleFactor,
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey[300]!),
        borderRadius: BorderRadius.circular(8),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<ComboboxItem>(
          value: _selectedValue != null &&
                  widget.combobox.any((item) => item.label == _selectedValue)
              ? widget.combobox
                  .firstWhere((item) => item.label == _selectedValue)
              : null,
          hint: Text(
            'Select data...',
            style: TextStyle(
              fontSize: 14 * widget.scaleFactor,
              color: Colors.grey[600],
            ),
          ),
          isExpanded: true,
          icon: Icon(
            Icons.arrow_drop_down, // Replace with your IconSelector equivalent
            size: 20 * widget.scaleFactor,
            color: Colors.grey[600],
          ),
          style: TextStyle(
            fontSize: 14 * widget.scaleFactor,
            color: Colors.black,
          ),
          dropdownColor: Colors.white,
          borderRadius: BorderRadius.circular(8),
          elevation: 4,
          items: widget.combobox.map((ComboboxItem item) {
            final isSelected = _selectedValue == item.label;
            return DropdownMenuItem<ComboboxItem>(
              value: item,
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      item.label,
                      style: TextStyle(
                        color:
                            isSelected ? const Color(0xFF46be80) : Colors.black,
                      ),
                    ),
                  ),
                  if (isSelected)
                    Icon(
                      Icons.check, // Replace with your IconCheck equivalent
                      size: 16 * widget.scaleFactor,
                      color: const Color(0xFF46be80),
                    ),
                ],
              ),
            );
          }).toList(),
          onChanged: widget.combobox.isEmpty
              ? null // Disable dropdown if no items
              : (ComboboxItem? newValue) {
                  if (newValue != null) {
                    setState(() {
                      _selectedValue = newValue.label;
                    });
                  }
                },
        ),
      ),
    );
  }
}
