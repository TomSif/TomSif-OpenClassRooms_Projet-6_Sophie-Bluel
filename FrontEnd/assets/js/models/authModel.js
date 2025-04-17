const LOGIN_URL = 'http://localhost:5678/api/users/login';

export async function loginUser(email, password) {
  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Email ou mot de passe incorrect');
  }

  return await response.json();
}
