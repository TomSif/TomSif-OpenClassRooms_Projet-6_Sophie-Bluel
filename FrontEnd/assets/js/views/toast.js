// toast.js - Version avec prise en compte correcte de modalStateManager
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
   * @param {number} duration - Durée d'affichage en ms (par défaut 3000ms)
   */
  show(message, type = this.types.INFO, duration = 1500) {
    // Création de l'élément toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Déterminer où placer le toast en fonction de l'état de la modale
    const modalState = modalStateManager.getState();
    
    // Si la modale est ouverte, on place le toast à l'intérieur de la modale
    // Sinon, on le place dans le body
    let container;
    
    if (modalState.isOpen) {
      // On cherche d'abord un conteneur de toast existant dans la modale
      container = document.querySelector('.secondary-modal .toast-container');
      if (!container) {
        // S'il n'existe pas, on le crée
        container = document.createElement('div');
        container.className = 'toast-container';
        
        // On le place dans la modale (ajustez le sélecteur selon votre structure)
        const modal = document.querySelector('.secondary-modal') || document.getElementById('modal');
        if (modal) {
          modal.appendChild(container);
        } else {
          // Fallback au body si on ne trouve pas la modale
          document.body.appendChild(container);
        }
      }
    } else {
      // Modale fermée, on utilise un conteneur dans le body
      container = document.querySelector('body > .toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
      }
    }
    
    // Ajout du toast au conteneur approprié
    container.appendChild(toast);
    
    // Animation d'entrée
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Suppression automatique après la durée spécifiée
    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => {
        toast.remove();
        // Suppression du conteneur s'il est vide
        if (container.children.length === 0) {
          container.remove();
        }
      });
    }, duration);
  },
  
  /**
   * Affiche un message de succès
   * @param {string} message - Le message à afficher
   * @param {number} duration - Durée d'affichage en ms
   */
  success(message, duration) {
    this.show(message, this.types.SUCCESS, duration);
  },
  
  /**
   * Affiche un message d'erreur
   * @param {string} message - Le message à afficher
   * @param {number} duration - Durée d'affichage en ms
   */
  error(message, duration) {
    this.show(message, this.types.ERROR, duration);
  },
  
  /**
   * Affiche un message d'information
   * @param {string} message - Le message à afficher
   * @param {number} duration - Durée d'affichage en ms
   */
  info(message, duration) {
    this.show(message, this.types.INFO, duration);
  }
};




// // toast.js
// /**
//  * Module de gestion centralisée des messages toast
//  * Permet d'afficher des messages de succès, d'erreur ou d'information
//  */

// export const Toast = {
//     types: {
//       SUCCESS: 'success',
//       ERROR: 'error',
//       INFO: 'info'
//     },
    
//     /**
//      * Affiche un message toast
//      * @param {string} message - Le message à afficher
//      * @param {string} type - Le type de message (success, error, info)
//      * @param {number} duration - Durée d'affichage en ms (par défaut 3000ms)
//      */
//     show(message, type = this.types.INFO, duration = 30000000) {
//       // Création de l'élément toast
//       const toast = document.createElement('div');
//       toast.className = `toast toast-${type}`;
//       toast.textContent = message;
      
//       // Création du conteneur de toasts s'il n'existe pas déjà
//       let toastContainer = document.querySelector('.toast-container');
//       if (!toastContainer) {
//         toastContainer = document.createElement('div');
//         toastContainer.className = 'toast-container';
//         document.body.appendChild(toastContainer);
//       }
      
//       // Ajout du toast au conteneur
//       toastContainer.appendChild(toast);
      
//       // Animation d'entrée
//       setTimeout(() => {
//         toast.classList.add('show');
//       }, 10);
      
//       // Suppression automatique après la durée spécifiée
//       setTimeout(() => {
//         toast.classList.remove('show');
//         toast.addEventListener('transitionend', () => {
//           toast.remove();
//           // Suppression du conteneur s'il est vide
//           if (toastContainer.children.length === 0) {
//             toastContainer.remove();
//           }
//         });
//       }, duration);
//     },
    
//     /**
//      * Affiche un message de succès
//      * @param {string} message - Le message à afficher
//      * @param {number} duration - Durée d'affichage en ms
//      */
//     success(message, duration) {
//       this.show(message, this.types.SUCCESS, duration);
//     },
    
//     /**
//      * Affiche un message d'erreur
//      * @param {string} message - Le message à afficher
//      * @param {number} duration - Durée d'affichage en ms
//      */
//     error(message, duration) {
//       this.show(message, this.types.ERROR, duration);
//     },
    
//     /**
//      * Affiche un message d'information
//      * @param {string} message - Le message à afficher
//      * @param {number} duration - Durée d'affichage en ms
//      */
//     info(message, duration) {
//       this.show(message, this.types.INFO, duration);
//     }
//   };