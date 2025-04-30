/**
 * Work upload model module handling file upload operations.
 * @module models/workUploadModel
 */

/**
 * Uploads a work item to the API using FormData.
 * @async
 * @function uploadWork
 * @export
 * @param {FormData} formData - Form data containing the work item to upload
 * @returns {Promise<Object>} The uploaded work item data
 * @throws {Error} When authentication token is missing or upload fails
 */
export async function uploadWork(formData) {
  const token = sessionStorage.getItem('token');  // Retrieve token from sessionStorage

  if (!token) {
    throw new Error('Token manquant');
  }

  try {
    const response = await fetch('https://tomsif-openclassrooms-projet-6-sophie.onrender.com/api/works', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`, // Use token in Authorization header
      },
      body: formData, // FormData handles Content-Type automatically
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de l’envoi de l’image');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    throw error;
  }
}