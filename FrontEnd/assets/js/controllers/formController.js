import { Toast } from '../views/toast.js';


export function handleContactForm() {
    const form = document.getElementById('contactForm');
  
    if (!form) {
      console.warn("⚠️ Formulaire de contact introuvable");
      return;
    }
  
    form.addEventListener('submit', (event) => {
      event.preventDefault(); // Empêche l'envoi réel du formulaire
  
      try {
        const name = form.elements.name.value.trim();
        const email = form.elements.email.value.trim();
        const message = form.elements.message.value.trim();
  
        // Vérifications simples
        if (!name) throw new Error('Le nom est requis');
        if (!email || !email.includes('@')) throw new Error('Un email valide est requis');
        if (!message || message.length < 10) throw new Error('Le message doit contenir au moins 10 caractères');
  
        Toast.success('✅ Message envoyé avec succès (simulation)');
        form.reset();
  
      } catch (err) {
        Toast.error(`❌ ${err.message}`);
      }
    });
  }
  