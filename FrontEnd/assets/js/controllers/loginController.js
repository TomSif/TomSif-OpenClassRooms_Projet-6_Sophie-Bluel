import { loginUser } from '../models/authModel.js';
import { showMessage } from '../views/messageView.js';

export function setupLoginForm() {
  console.log('🔑 setupLoginForm initialisé');

  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // ✅ Test : Vérifie si les champs sont bien récupérés
    console.log('📤 Données envoyées :', { email, password });

    try {
      // ✅ Test : on tente la connexion
      const data = await loginUser(email, password);

      // ✅ Test : on vérifie la réponse de l’API
      console.log('✅ Réponse de login :', data);

      localStorage.setItem('token', data.token);
      localStorage.setItem('isAdmin', 'true');
      showMessage('Connexion réussie !', 'success');

      // ✅ Test : vérifier que la redirection se fait bien
      console.log('➡️ Redirection vers ../index.html');
      window.location.href = '../index.html';

    } catch (error) {
      // ❌ Si erreur : on affiche clairement l’objet erreur
      console.error('❌ Erreur de connexion :', error);
      showMessage(error.message, 'error');
    }
  });
}
