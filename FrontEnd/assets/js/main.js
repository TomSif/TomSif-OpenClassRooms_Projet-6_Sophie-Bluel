import { initTravaux } from './controllers/travauxController.js';
import { setupLoginForm } from './controllers/loginController.js';
import { setupModalButtons } from './controllers/modalController.js';
import { toggleEditMode } from './views/modalView.js';
import { confirmerSuppression } from './controllers/travauxController.js';
import { handleContactForm } from './controllers/formController.js';


window.confirmerSuppression = confirmerSuppression;

console.log('✅ main.js chargé');

// Fonction helper pour vérifier l'authentification et le statut admin
window.checkAuthentication = function() {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  const isAdmin = isAuthenticated && localStorage.getItem('isAdmin') === 'true'; 
  return { isAuthenticated, isAdmin };
};

// Fonction d'initialisation de l'application
function initApp() {
  // Vérifier si l'utilisateur est sur la page de connexion
  if (document.getElementById('login-form')) {
    setupLoginForm();
  } else {
    // Vérifier l'authentification et l'état admin
    const { isAuthenticated, isAdmin } = window.checkAuthentication();

    // Initialiser les contrôleurs
    initTravaux();
    setupModalButtons();
    handleContactForm();

    // Initialiser l'UI d'authentification
    setupAuthenticationUI();

    // Activer le mode édition si l'utilisateur est admin
    if (isAdmin) {
      toggleEditMode(true);
      console.log('✅ Mode édition activé');
    }
  }
}

// Attendre que le DOM soit complètement chargé avant d'initialiser l'application
document.addEventListener('DOMContentLoaded', initApp);