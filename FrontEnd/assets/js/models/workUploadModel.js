// models/workUploadModel.js

export async function uploadWork(formData, token) {
    try {
      const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // FormData gère lui-même le Content-Type (multipart/form-data)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l’envoi de l’image');
      }
  
      return await response.json();
    } catch (error) {
      Toast.error('Erreur lors de l’upload du travail :', error);
      throw error;
    }
  }
  