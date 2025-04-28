import { Toast } from '../views/toast.js';

const validateName = (name) => {
  if (!name) return 'Le nom est requis';
  return null;
};

const validateEmail = (email) => {
  if (!email || !email.includes('@')) return 'Un email valide est requis';
  return null;
};

const validateMessage = (message) => {
  if (!message || message.length < 10) return 'Le message doit contenir au moins 10 caractères';
  return null;
};

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
    ].filter(error => error !== null); // Filtre les erreurs nulles

    if (errors.length > 0) {
      errors.forEach(error => Toast.error(`❌ ${error}`));
      return;
    }

    Toast.success('✅ Message envoyé avec succès (simulation)');
    form.reset();
  });
}
