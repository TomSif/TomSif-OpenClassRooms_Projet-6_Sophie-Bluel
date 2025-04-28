import { Toast } from '../views/toast.js';

const LOGIN_URL = 'http://localhost:5678/api/users/login';

export async function loginUser(email, password) {
  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    Toast.error("Email ou mot de passe incorrect");
    throw new Error('Email ou mot de passe incorrect');
  }

  const data = await response.json();
  
  // Stocker le token dans le sessionStorage
  sessionStorage.setItem('token', data.token);
  
  return data; // Retourner les données pour d'autres utilisations si nécessaire
}