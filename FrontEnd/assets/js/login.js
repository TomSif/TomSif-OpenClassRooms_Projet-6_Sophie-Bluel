const form = document.getElementById('login-form');
const message = document.getElementById('message');


form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const data = await response.json();
    const token = data.token;

    // On stocke le token
    localStorage.setItem('token', token);
    message.textContent = 'Connexion réussie !';
    message.style.color = 'green';

    window.location.href = '../index.html'


  } catch (error) {
    message.textContent = error.message;
    message.style.color = 'red';
  }
});

