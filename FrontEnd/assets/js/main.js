/**
 * Main application entry point.
 * @module main
 */

import { initTravaux } from './controllers/travauxController.js';
import { setupLoginForm } from './controllers/loginController.js';
import { setupModalButtons } from './controllers/modalController.js';
import { toggleEditMode, setupAuthenticationUI } from './views/adminView.js';
import { confirmerSuppression } from './controllers/travauxController.js';
import { handleContactForm } from './controllers/formController.js';
import { setupAccessibleUploadLabel } from './utils/keyDownBtn.js';

/**
 * Global reference to the deletion confirmation function.
 * @global
 * @function confirmerSuppression
 */
window.confirmerSuppression = confirmerSuppression;

console.log('✅ main.js loaded');

/**
 * Helper function to check authentication status and admin privileges.
 * @global
 * @function checkAuthentication
 * @returns {Object} Authentication status object
 * @property {boolean} isAdmin - Indicates if user has admin privileges
 */
window.checkAuthentication = () => ({
  isAdmin: !!sessionStorage.getItem('token')
});

/**
 * Initializes the application by setting up controllers and UI based on authentication status.
 * @function initApp
 * @listens DOMContentLoaded
 */
function initApp() {
  // Check if user is on login page
  if (document.getElementById('login-form')) {
    setupLoginForm();
  } else {
    // Check authentication and admin status
    const { isAdmin } = window.checkAuthentication();

    // Initialize controllers
    initTravaux();
    setupModalButtons();
    handleContactForm();

    // Initialize authentication UI
    setupAuthenticationUI();

    // Enable edit mode if user is admin
    if (isAdmin) {
      toggleEditMode(true);
      console.log('✅ Edit mode activated');
    }

    // Initialize key listener on label input-file
    setupAccessibleUploadLabel();  
  }
}

// Wait for DOM to be fully loaded before initializing the application
document.addEventListener('DOMContentLoaded', initApp);