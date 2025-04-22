const API_BASE_URL = 'http://localhost:5678/api';

export async function deleteWorkById(id, token) {
  const response = await fetch(`${API_BASE_URL}/works/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la suppression');
  }

  return true;
}
