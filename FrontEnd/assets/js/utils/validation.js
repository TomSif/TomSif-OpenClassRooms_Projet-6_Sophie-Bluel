export function validerFichierImage(fichier) {
    const typesAutorises = ['image/jpeg', 'image/png'];
    const tailleMaxOctets = 4 * 1024 * 1024; // 4 Mo
  
    if (!typesAutorises.includes(fichier.type)) {
      return { valide: false, message: "Format non supporté. Utilisez jpg ou png." };
    }
  
    if (fichier.size > tailleMaxOctets) {
      return { valide: false, message: "Fichier trop lourd. Maximum 4 Mo autorisé." };
    }
  
    return { valide: true };
  }
  