// toast.js - Version optimisée avec modalStateManager central
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
  show(message, type = this.types.INFO, duration = 1500) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    const { activeModal } = modalStateManager.getState();
    let container;

    if (activeModal === 'secondary') {
      const secondaryModal = document.querySelector('.secondary-modal');
      if (secondaryModal) {
        container = secondaryModal.querySelector('.toast-container');
        if (!container) {
          container = document.createElement('div');
          container.className = 'toast-container';
          secondaryModal.appendChild(container);
        }
      }
    } else if (activeModal === 'main') {
      const mainModal = document.querySelector('#modal');
      if (mainModal) {
        container = mainModal.querySelector('.toast-container');
        if (!container) {
          container = document.createElement('div');
          container.className = 'toast-container';
          mainModal.appendChild(container);
        }
      }
    }

    // Fallback sur le body si aucune modale n'est active
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

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => {
        toast.remove();
        if (container.children.length === 0) {
          container.remove();
        }
      });
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
