import { loginUser } from '../models/authModel.js';
import { Toast } from "../views/toast.js";

export function setupLoginForm() {

  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('isAdmin', 'true');
      Toast.success('Connexion réussie !');
      // Animation d'entrée
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 1000);
    } catch (error) {
      Toast.error("'Email ou mot de passe incorrect");
    }
  });
}
