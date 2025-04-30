/**
 * Delete model module handling work item deletion operations.
 * @module models/deleteModel
 */

/** 
 * Base API URL for works endpoint
 * @constant {string}
 * @default
 */
// const API_BASE_URL = 'http://localhost:5678/api';
const API_BASE_URL = 'https://tomsif-openclassrooms-projet-6-sophie.onrender.com/api';

/**
 * Deletes a work item by ID using authentication token.
 * @async
 * @function deleteWorkById
 * @export
 * @param {number} id - ID of the work item to delete
 * @param {string} token - Authentication token
 * @returns {Promise<boolean>} True if deletion was successful
 * @throws {Error} When ID is missing or deletion fails
 */
export async function deleteWorkById(id, token) {
  if (!id) {
    console.error('ID non défini lors de la tentative de suppression');
    throw new Error('ID manquant');
  }

  const response = await fetch(`${API_BASE_URL}/works/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();  // Get error details
    console.error('Erreur lors de la suppression:', errorData);
    throw new Error(errorData.message || 'Erreur lors de la suppression');
  }
  
  return true;
}