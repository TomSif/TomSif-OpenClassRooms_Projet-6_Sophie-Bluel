/**
 * Login controller module handling authentication form setup.
 * @module controllers/loginController
 */

import { loginUser } from '../models/authModel.js';
import { validateLogin } from '../utils/validation.js';
import { Toast } from "../views/toast.js";

/**
 * Sets up the login form with submission handling.
 * @function setupLoginForm
 * @export
 */
export function setupLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if(!validateLogin(email, password)) return;

    try {
      const data = await loginUser(email, password);
      sessionStorage.setItem('token', data.token);
      console.log(data.token);
      Toast.success('Connexion réussie !');
      // Entry animation delay
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 1000);
    } catch (error) {
      Toast.error("Email ou mot de passe incorrect");
    }
  });
}

/**
 * Handles "forgot password" click event.
 * @private
 * @type {HTMLElement}
 */
const forgetPassword = document.getElementById('forgetPassword');
if(forgetPassword){
  forgetPassword.addEventListener('click', ()=> {
    Toast.info('un email de récupération vous a été envoyé');
  })
};