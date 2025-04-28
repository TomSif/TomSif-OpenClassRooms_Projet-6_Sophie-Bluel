const API_BASE_URL = 'http://localhost:5678/api';

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
    const errorData = await response.json();  // Récupérer les données d'erreur
    console.error('Erreur lors de la suppression:', errorData);
    throw new Error(errorData.message || 'Erreur lors de la suppression');
  }
  
  return true;
}