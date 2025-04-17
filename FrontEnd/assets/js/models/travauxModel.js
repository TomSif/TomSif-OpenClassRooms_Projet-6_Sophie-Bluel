const API_URL = 'http://localhost:5678/api/works';

export async function fetchTravaux() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des travaux');
  }
  return await response.json();
}