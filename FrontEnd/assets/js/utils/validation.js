/**
 * Validation utilities module.
 * @module utils/validation
 */

/**
 * Validates an image file against type and size constraints.
 * @function validerFichierImage
 * @export
 * @param {File} fichier - The image file to validate
 * @returns {Object} Validation result object
 * @property {boolean} valide - Whether the file is valid
 * @property {string} [message] - Error message if validation fails
 * @example
 * const result = validerFichierImage(file);
 * if (!result.valide) {
 *   console.error(result.message);
 * }
 */
export function validerFichierImage(fichier) {
  const typesAutorises = ['image/jpeg', 'image/png'];
  const tailleMaxOctets = 4 * 1024 * 1024; // 4 MB

  if (!typesAutorises.includes(fichier.type)) {
    return { valide: false, message: "Veuillez choisir un fichier JPG ou PNG." };
  }

  if (fichier.size > tailleMaxOctets) {
    return { valide: false, message: "Veuillez choisir un fichier inférieur à 4 Mo." };
  }

  return { valide: true };
}


/**
 * Valide les champs email et mot de passe du formulaire de connexion.
 * Affiche des messages d'erreur via Toast selon les cas.
 * @param {string} email - L'adresse email saisie.
 * @param {string} password - Le mot de passe saisi.
 * @returns {boolean} - Retourne true si les champs sont valides.
 */
export function validateLogin(email, password) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.trim()) {
    Toast.error("Veuillez entrer une adresse email.");
    return false;
  }

  if (!emailRegex.test(email)) {
    Toast.error("L'adresse email n'est pas valide.");
    return false;
  }

  if (!password.trim()) {
    Toast.error("Veuillez entrer un mot de passe.");
    return false;
  }

  return true;
}