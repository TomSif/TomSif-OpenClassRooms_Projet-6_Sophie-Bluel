import { modalStateManager } from '../utils/modalState.js';

export const Toast = {
  types: {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info'
  },

  /**
   * Affiche un message toast en tenant compte de l'état de la modale
   * @param {string} message - Le message à afficher
   * @param {string} type - Le type de message (success, error, info)
   * @param {number} duration - Durée d'affichage en ms (par défaut 1500ms)
   */

  show(message, type = this.types.INFO, duration = 1300) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Création du contenu du toast (texte)
    const messageElement = document.createElement('div');
    messageElement.className = 'toast-message';
    messageElement.textContent = message;
    toast.appendChild(messageElement);
    
    // Création de la barre de progression
    const progressBar = document.createElement('div');
    progressBar.className = 'toast-progress';
    toast.appendChild(progressBar);

    // Récupérer l'état actuel
    const { activeModal } = modalStateManager.getState();
    let container = null;

    // Vérifier si les modales existent ET sont ouvertes (visibles)
    const secondaryModal = document.querySelector('.secondary-modal:not(.display-none)');
    const mainModal = document.querySelector('#modal:not(.hidden)');
    
    // Déterminer où placer le toast en fonction de l'état réel des modales, pas seulement de l'état enregistré
    if (activeModal === 'secondary' && secondaryModal) {
      // Vérifier que la modale secondaire est réellement ouverte
      if (secondaryModal.open) {
        container = secondaryModal.querySelector('.toast-container');
        if (!container) {
          container = document.createElement('div');
          container.className = 'toast-container';
          secondaryModal.appendChild(container);
        }
      }
    } else if (activeModal === 'main' && mainModal) {
      // Vérifier que la modale principale est réellement ouverte
      if (mainModal.open) {
        container = mainModal.querySelector('.toast-container');
        if (!container) {
          container = document.createElement('div');
          container.className = 'toast-container';
          mainModal.appendChild(container);
        }
      }
    }

    // Si aucune modale n'est active ou si les modales sont fermées, utiliser le body
    if (!container) {
      container = document.querySelector('body > .toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
      }
    }

    // Insertion du toast
    container.appendChild(toast);

    // Animation d'apparition du toast
    setTimeout(() => {
      toast.classList.add('show');
      // Animation de la barre de progression
      progressBar.style.transition = `width ${duration-80}ms linear`;
      progressBar.style.width = '100%';  // Commence plein et se vide
    }, 10);

    // Disparition du toast après la durée spécifiée
    setTimeout(() => {
      toast.classList.remove('show');
      
      const handleTransitionEnd = () => {
        toast.removeEventListener('transitionend', handleTransitionEnd);
        toast.remove();
        
        // Ne supprimer le conteneur que s'il est vide
        if (container && container.children.length === 0 && container.parentNode) {
          container.remove();
        }
      };
      
      toast.addEventListener('transitionend', handleTransitionEnd);
    }, duration);
  },

  success(message, duration) {
    this.show(message, this.types.SUCCESS, duration);
  },

  error(message, duration) {
    this.show(message, this.types.ERROR, duration);
  },

  info(message, duration) {
    this.show(message, this.types.INFO, duration);
  }
};