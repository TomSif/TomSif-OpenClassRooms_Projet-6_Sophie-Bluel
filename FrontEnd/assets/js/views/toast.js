/**
 * Toast notification module for displaying temporary messages.
 * @module views/toast
 */

import { modalStateManager } from '../utils/modalState.js';

/**
 * Toast notification system with multiple message types and display options.
 * @namespace Toast
 * @property {Object} types - Available toast types
 * @property {string} types.SUCCESS - Success message type
 * @property {string} types.ERROR - Error message type
 * @property {string} types.INFO - Info message type
 */
export const Toast = {
  types: {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info'
  },

  /**
   * Displays a toast message considering modal state.
   * @function show
   * @memberof Toast
   * @param {string} message - Message to display
   * @param {string} [type=this.types.INFO] - Type of message (success, error, info)
   * @param {number} [duration=1300] - Display duration in milliseconds
   */
  show(message, type = this.types.INFO, duration = 1300) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Create toast content (text)
    const messageElement = document.createElement('div');
    messageElement.className = 'toast-message';
    messageElement.textContent = message;
    toast.appendChild(messageElement);
    
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'toast-progress';
    toast.appendChild(progressBar);

    // Get current modal state
    const { activeModal } = modalStateManager.getState();
    let container = null;

    // Check if modals exist AND are open (visible)
    const secondaryModal = document.querySelector('.secondary-modal:not(.display-none)');
    const mainModal = document.querySelector('#modal:not(.hidden)');
    
    // Determine toast placement based on actual modal state
    if (activeModal === 'secondary' && secondaryModal) {
      // Verify secondary modal is actually open
      if (secondaryModal.open) {
        container = secondaryModal.querySelector('.toast-container');
        if (!container) {
          container = document.createElement('div');
          container.className = 'toast-container';
          secondaryModal.appendChild(container);
        }
      }
    } else if (activeModal === 'main' && mainModal) {
      // Verify main modal is actually open
      if (mainModal.open) {
        container = mainModal.querySelector('.toast-container');
        if (!container) {
          container = document.createElement('div');
          container.className = 'toast-container';
          mainModal.appendChild(container);
        }
      }
    }

    // If no active modal or modals are closed, use body
    if (!container) {
      container = document.querySelector('body > .toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
      }
    }

    // Insert toast
    container.appendChild(toast);

    // Toast appearance animation
    setTimeout(() => {
      toast.classList.add('show');
      // Progress bar animation
      progressBar.style.transition = `width ${duration-80}ms linear`;
      progressBar.style.width = '100%';  // Starts full and empties
    }, 10);

    // Toast disappearance after specified duration
    setTimeout(() => {
      toast.classList.remove('show');
      
      const handleTransitionEnd = () => {
        toast.removeEventListener('transitionend', handleTransitionEnd);
        toast.remove();
        
        // Only remove container if empty
        if (container && container.children.length === 0 && container.parentNode) {
          container.remove();
        }
      };
      
      toast.addEventListener('transitionend', handleTransitionEnd);
    }, duration);
  },

  /**
   * Displays a success toast message.
   * @function success
   * @memberof Toast
   * @param {string} message - Success message to display
   * @param {number} [duration] - Optional display duration
   */
  success(message, duration) {
    this.show(message, this.types.SUCCESS, duration);
  },

  /**
   * Displays an error toast message.
   * @function error
   * @memberof Toast
   * @param {string} message - Error message to display
   * @param {number} [duration] - Optional display duration
   */
  error(message, duration) {
    this.show(message, this.types.ERROR, duration);
  },

  /**
   * Displays an info toast message.
   * @function info
   * @memberof Toast
   * @param {string} message - Info message to display
   * @param {number} [duration] - Optional display duration
   */
  info(message, duration) {
    this.show(message, this.types.INFO, duration);
  }
};