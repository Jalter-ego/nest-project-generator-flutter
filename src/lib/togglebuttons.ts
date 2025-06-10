import { libraryIcons } from "./icons";

export const togglebuttons = (item:any) =>`
Card(
                key: const ValueKey('toggle-card'),
                elevation: 2,
                shape: RoundedRectangleBorder(
                  side: BorderSide(color: Colors.grey.withOpacity(0.5)),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Padding(
                  padding: EdgeInsets.all(8 * scaleFactor),
                  child: StatefulBuilder(
                    builder: (context, setCheck) {
                      double _toggleState = ${item.initialActive};
                      return Row(
                        children: [
                          GestureDetector(
                            onTap: () => setCheck(() => _toggleState = 0),
                            child: Container(
                              width: 40 * scaleFactor,
                              height: 40 * scaleFactor,
                              decoration: BoxDecoration(
                                color: _toggleState == 0
                                    ? const Color.fromARGB(255, 78, 162, 208)
                                        .withOpacity(0.3)
                                    : Colors.transparent, // Inactive
                                shape: BoxShape.circle,
                              ),
                              child: Center(
                                child: ${libraryIcons(item.buttons[0].icon)}
                              ),
                            ),
                          ),
                          SizedBox(width: 8 * scaleFactor),
                          GestureDetector(
                            onTap: () => setCheck(() => _toggleState = 1),
                            child: Container(
                              width: 40 * scaleFactor,
                              height: 40 * scaleFactor,
                              decoration: BoxDecoration(
                                color: _toggleState == 1
                                    ? const Color.fromARGB(255, 78, 162, 208)
                                        .withOpacity(0.3)
                                    : Colors.transparent, // Inactive
                                shape: BoxShape.circle,
                              ),
                              child: Center(
                                child:  ${libraryIcons(item.buttons[1].icon)}
                              ),
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                ),
              ),
`