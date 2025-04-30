/**
 * Category model module handling category data operations.
 * @module models/categoryModel
 */

/**
 * Extracts unique valid categories from works array.
 * @function getUniqueCategories
 * @export
 * @param {Array} travaux - Array of work items
 * @property {Object} travaux[].category - Category object
 * @property {number} travaux[].category.id - Category ID
 * @returns {Array} Array of unique category objects
 */
export function getUniqueCategories(travaux) {
  return Array.from(
    new Map(
      travaux
        .filter(t => t.categoryId && t.category) // security against duplicates
        .map(t => [t.category.id, t.category])
    ).values()
  );
}

/** 
 * API endpoint for categories
 * @constant {string}
 * @default
 */
// const API_URL = 'http://localhost:5678/api/categories';
const API_URL = 'https://tomsif-openclassrooms-projet-6-sophie.onrender.com/api/categories';

/**
 * Fetches categories from API.
 * @async
 * @function fetchCategories
 * @export
 * @returns {Promise<Array>} Array of category objects
 * @throws {Error} When API request fails
 */
export async function fetchCategories() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des catégories');
  }
  const data = await response.json();
  return data;
}