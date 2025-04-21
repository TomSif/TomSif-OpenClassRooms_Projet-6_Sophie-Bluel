export function validerFichierImage(fichier) {
  const typesAutorises = ['image/jpeg', 'image/png'];
  const tailleMaxOctets = 4 * 1024 * 1024; // 4 Mo

  if (!typesAutorises.includes(fichier.type)) {
    return { valide: false, message: "Veuillez choisir un fichier JPG ou PNG." };
  }

  if (fichier.size > tailleMaxOctets) {
    return { valide: false, message: "Veuillez choisir un fichier inférieur à 4 Mo." };
  }

  return { valide: true };
}
