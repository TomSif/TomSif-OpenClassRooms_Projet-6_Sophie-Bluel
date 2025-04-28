export async function uploadWork(formData) {
  const token = sessionStorage.getItem('token');  // Récupérer le token depuis sessionStorage

  if (!token) {
    throw new Error('Token manquant');
  }

  try {
    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`, // Utiliser le token dans l'en-tête Authorization
      },
      body: formData, // FormData gère le Content-Type
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
