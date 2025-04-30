/**
 * Form controller module handling form validation and submission.
 * @module controllers/formController
 */

import { Toast } from '../views/toast.js';

/**
 * Validates the name field.
 * @private
 * @function validateName
 * @param {string} name - Name to validate
 * @returns {string|null} Error message if invalid, null if valid
 */
const validateName = (name) => {
  if (!name) return 'Le nom est requis';
  return null;
};

/**
 * Validates the email field.
 * @private
 * @function validateEmail
 * @param {string} email - Email to validate
 * @returns {string|null} Error message if invalid, null if valid
 */
const validateEmail = (email) => {
  if (!email || !email.includes('@')) return 'Un email valide est requis';
  return null;
};

/**
 * Validates the message field.
 * @private
 * @function validateMessage
 * @param {string} message - Message to validate
 * @returns {string|null} Error message if invalid, null if valid
 */
const validateMessage = (message) => {
  if (!message || message.length < 10) return 'Le message doit contenir au moins 10 caractères';
  return null;
};

/**
 * Initializes contact form handling with validation and submission logic.
 * @function handleContactForm
 * @export
 * @example
 * // Initialize form handling when DOM is ready
 * handleContactForm();
 */
export function handleContactForm() {
  const form = document.getElementById('contactForm');

  if (!form) {
    Toast.error('⚠️ Formulaire de contact introuvable');
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();

    const errors = [
      validateName(name),
      validateEmail(email),
      validateMessage(message)
    ].filter(error => error !== null); 

    if (errors.length > 0) {
      errors.forEach(error => Toast.error(`❌ ${error}`));
      return;
    }

    Toast.success('✅ Message envoyé avec succès (simulation)');
    form.reset();
  });
}