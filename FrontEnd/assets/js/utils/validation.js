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