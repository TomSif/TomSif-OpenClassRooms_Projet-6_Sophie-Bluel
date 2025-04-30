/**
 * Works model module handling work items data operations.
 * @module models/travauxModel
 */

/** 
 * API endpoint for works
 * @constant {string}
 * @default
 */
const API_URL = 'http://localhost:5678/api/works';

/**
 * Fetches all work items from the API.
 * @async
 * @function fetchTravaux
 * @export
 * @returns {Promise<Array>} Array of work items
 * @throws {Error} When API request fails
 */
export async function fetchTravaux() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des travaux');
  }
  return await response.json();
}