export const libraryIcons = (icon) => {
  switch (
    icon.toLowerCase() 
  ) {
    case 'iconuser':
      return `Icon(Icons.person, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconsearch':
      return `Icon(Icons.search, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconlock':
      return `Icon(Icons.lock, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconmenudeep':
      return `Icon(Icons.menu, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconmenudots':
      return `Icon(Icons.menu, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconheart':
      return `Icon(Icons.favorite_outline, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconmessage':
      return `Icon(Icons.message, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconheadphones':
      return `Icon(Icons.headphones, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconlogin':
      return `Icon(Icons.login, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconlogout':
      return `Icon(Icons.logout, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconadd':
      return `Icon(Icons.add, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'icontag':
      return `Icon(Icons.label, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconshare':
      return `Icon(Icons.share, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'icondotshorizontal':
      return `Icon(Icons.more_horiz, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconplane':
      return `Icon(Icons.send, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconimage':
      return `Icon(Icons.image, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'icontext':
      return `Icon(Icons.text_fields, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconemoji':
      return `Icon(Icons.emoji_emotions, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconmicrophone':
      return `Icon(Icons.mic, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconarrowup':
      return `Icon(Icons.arrow_upward, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconarrowdown':
      return `Icon(Icons.arrow_downward, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconarrowleft':
      return `Icon(Icons.arrow_back, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconarrowright':
      return `Icon(Icons.arrow_forward, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconarrowupdown':
      return `Icon(Icons.keyboard_double_arrow_up, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'icontrash':
      return `Icon(Icons.delete, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconpencil':
      return `Icon(Icons.edit, size: 32 * scaleFactor, color: Colors.grey[800])`;
    case 'iconx':
      return `Icon(Icons.cancel, size: 32 * scaleFactor, color: Colors.grey[800])`;
    default:
      return `Icon(Icons.error, size: 32 * scaleFactor, color: Colors.red)`; // Fallback icon
  }
};
