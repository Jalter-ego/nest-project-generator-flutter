import { libraryIcons } from "./icons";

export const cardList = (item:any,index:number)=>
`
Card(
                  key: UniqueKey(),
                  elevation: 2,
                  shape: RoundedRectangleBorder(
                    side: BorderSide(
                      color: Colors.grey.withOpacity(0.5),
                    ),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Padding(
                    padding: EdgeInsets.all(12 * scaleFactor),
                    child: SizedBox(
                      width: 180 * scaleFactor,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Expanded(
                            child: Row(
                              children: [
                                ${libraryIcons(item.icon)},
                                SizedBox(width: 12 * scaleFactor),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      '${item.title}',
                                      style: TextStyle(
                                        fontSize: 16 * scaleFactor,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      '${item.subtitle}',
                                      style: TextStyle(
                                        fontSize: 14 * scaleFactor,
                                        color: Colors.grey[600],
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),

                          // Checkbox
                          StatefulBuilder(
                            builder: (context, setCheckboxState) {
                              bool? isChecked = ${item.checked};
                              return Checkbox(
                                value: isChecked,
                                onChanged: (val) {
                                  setCheckboxState(() {
                                    isChecked = val;
                                  });
                                },
                                materialTapTargetSize:
                                    MaterialTapTargetSize.shrinkWrap,
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
`