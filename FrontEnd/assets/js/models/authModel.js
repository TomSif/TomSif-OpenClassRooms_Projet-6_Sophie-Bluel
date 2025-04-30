/**
 * Authentication model module handling user login operations.
 * @module models/authModel
 */

import { Toast } from '../views/toast.js';

/** 
 * API endpoint for user login
 * @constant {string}
 * @default
 */
// const LOGIN_URL = 'http://localhost:5678/api/users/login';
const LOGIN_URL = 'https://tomsif-openclassrooms-projet-6-sophie.onrender.com/api/users/login';

/**
 * Authenticates a user with email and password.
 * @async
 * @function loginUser
 * @export
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} Authentication response data
 * @throws {Error} When authentication fails
 */
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
  
  // Store token in sessionStorage
  sessionStorage.setItem('token', data.token);
  
  return data; // Return data for potential other uses
}