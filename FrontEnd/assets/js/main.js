import { initTravaux } from './controllers/travauxController.js';
import { setupLoginForm } from './controllers/loginController.js';
import { setupModalButtons } from './controllers/modalController.js';
import { toggleEditMode } from './views/modalView.js';
import { confirmerSuppression } from './controllers/modalController.js';

window.confirmerSuppression = confirmerSuppression;

console.log('✅ main.js chargé');

// Fonction d'initialisation de l'application
function initApp() {
  // Vérifier si l'utilisateur est sur la page de connexion
  if (document.getElementById('login-form')) {
    setupLoginForm();
  } else {
    // Vérifier si l'utilisateur est authentifié comme admin
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    // Initialiser les contrôleurs
    initTravaux();
    const modalControls = setupModalButtons();
    
    // Exposer les fonctions de mise à jour de l'interface
    window.updateGalleryView = function(travaux) {
      if (window.afficherGaleriePrincipale) {
        window.afficherGaleriePrincipale(travaux);
      }
    };
    
    // Activer le mode édition si l'utilisateur est admin
    if (isAdmin) {
      toggleEditMode(true);
      console.log('✅ Mode édition activé');
    }
    
    // Fonction helper pour faire un checkAuth n'importe où dans l'application
    window.checkAuthentication = function() {
      const token = localStorage.getItem('token');
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      return { isAuthenticated: !!token, isAdmin };
    };
  }
}

// Attendre que le DOM soit complètement chargé avant d'initialiser l'application
document.addEventListener('DOMContentLoaded', initApp);

// Intercepter les erreurs pour faciliter le débogage
window.addEventListener('error', (event) => {
  console.error('Erreur détectée :', event.message, event.filename, event.lineno);
});