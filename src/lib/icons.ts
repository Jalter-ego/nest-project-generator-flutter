export const libraryIcons = (icon) => {
  switch (
    icon.toLowerCase() 
  ) {
    case 'iconuser':
      return `Icon(Icons.person_outlined, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconsearch':
      return `Icon(Icons.search, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconlock':
      return `Icon(Icons.lock, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconmenudeep':
      return `Icon(Icons.menu, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconmenudots':
      return `Icon(Icons.menu, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconheart':
      return `Icon(Icons.favorite_outline, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconmessage':
      return `Icon(Icons.message, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconheadphones':
      return `Icon(Icons.headphones, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconlogin':
      return `Icon(Icons.login, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconlogout':
      return `Icon(Icons.logout, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconadd':
      return `Icon(Icons.add, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'icontag':
      return `Icon(Icons.label, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconshare':
      return `Icon(Icons.share, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'icondotshorizontal':
      return `Icon(Icons.more_horiz, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconplane':
      return `Icon(Icons.send, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconimage':
      return `Icon(Icons.image, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'icontext':
      return `Icon(Icons.text_fields, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconemoji':
      return `Icon(Icons.emoji_emotions, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconmicrophone':
      return `Icon(Icons.mic, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconarrowup':
      return `Icon(Icons.arrow_upward, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconarrowdown':
      return `Icon(Icons.arrow_downward, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconarrowleft':
      return `Icon(Icons.arrow_back, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconarrowright':
      return `Icon(Icons.arrow_forward, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconarrowupdown':
      return `Icon(Icons.keyboard_double_arrow_up, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'icontrash':
      return `Icon(Icons.delete, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconpencil':
      return `Icon(Icons.edit, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconx':
      return `Icon(Icons.cancel, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'icontimepicker':
      return `Icon(Icons.timer_sharp, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'icontable':
      return `Icon(Icons.auto_awesome_mosaic_outlined, size: 24 * scaleFactor, color: Colors.grey[800])`;
    case 'iconhome':
      return `Icon(Icons.home_outlined, size: 24 * scaleFactor, color: Colors.grey[800])`;
    default:
      return `Icon(Icons.error, size: 24 * scaleFactor, color: Colors.red)`; // Fallback icon
  }
};

export const IconNavegable = (icon:string,onPressed:any) =>
`
GestureDetector(
                onTap: ${onPressed},
                child: ${libraryIcons(icon)}
              ),
`
