export const badge = (style:any) => `
Stack(
                clipBehavior:
                    Clip.none, 
                children: [
                  Container(
                    width: 50 * scaleFactor,
                    height: 50 * scaleFactor,
                    decoration: const BoxDecoration(
                      color: Color.fromARGB(
                          255, 207, 213, 209),
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Text(
                        '${style.text}', 
                        style: TextStyle(
                          fontSize: 25 * scaleFactor,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    right: -4 * scaleFactor, 
                    top: -4 * scaleFactor, 
                    child: Container(
                      width: 20 * scaleFactor,
                      height: 20 * scaleFactor,
                      decoration: const BoxDecoration(
                        color: const Color(0xFF${style.bg?.substring(1) || '000000'}),
                        shape: BoxShape.circle,
                        border: Border.fromBorderSide(
                          BorderSide(
                              color: Colors.white,
                              width: 1), 
                        ),
                      ),
                      child: Center(
                        child: Text(
                          '${style.label}',
                          style: TextStyle(
                              fontSize: 10 * scaleFactor, color: Colors.white),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
`