/**
 * Modal controller module handling modal dialog interactions and state management.
 * @module controllers/modalController
 */

import { chargerGalerieModal } from '../views/modalView.js';
import { modalStateManager } from '../utils/modalState.js'; 

/**
 * Sets up modal buttons and event handlers.
 * @function setupModalButtons
 * @export
 * @returns {Object} Public modal control functions
 * @property {function} openMainModal - Opens the main modal
 * @property {function} fermerModal - Closes the main modal
 * @example
 * const modalControls = setupModalButtons();
 * // Can use returned functions if needed
 * modalControls.openMainModal();
 */
export function setupModalButtons() {
    // Group all DOM selections
    const elements = {
        mainModal: document.getElementById('modal'),
        secondaryModal: document.getElementById('secondary-modal'),
        openSecondaryBtn: document.getElementById('open-secondary'),
        closeSecondaryBtn: document.getElementById('close-secondary-modal'),
        closeFromSecondary: document.getElementById('close-main-modal-from-secondary'),
        btnModifier: document.getElementById('btnModifier'),
        banner: document.getElementById('banner'),
        loginButton: document.getElementById('login'),
        closeBtn: document.getElementById('close-modal'),
        galleryModal: document.getElementById('galery-modal')
    };

    /**
     * Opens the main modal and loads gallery content if needed.
     * @function openMainModal
     * @private
     */
    function openMainModal() {
        if (!elements.mainModal) return;
        
        elements.mainModal.showModal();
        elements.mainModal.classList.remove('hidden');
        
        if (window.travaux && !modalStateManager.getState().isLoaded) {
            chargerGalerieModal(window.travaux);
            modalStateManager.updateState({ isOpen: true, isLoaded: true, activeModal: 'main' });
        }
    }

    /**
     * Closes the main modal and resets state.
     * @function fermerModal
     * @private
     */
    function fermerModal() {
        if (!elements.mainModal) return;
        
        elements.mainModal.close();
        elements.mainModal.classList.add('hidden');
        
        modalStateManager.updateState({ isOpen: false });
        modalStateManager.resetGalerie();
    }

    /**
     * Opens the secondary modal.
     * @function openSecondaryModal
     * @private
     */
    function openSecondaryModal() {
        if (elements.secondaryModal) {
            elements.secondaryModal.classList.remove("display-none");
            elements.secondaryModal.showModal();
            modalStateManager.updateState({ isOpen: true, activeModal: 'secondary' });
        }
    }

    /**
     * Closes the secondary modal and manages state transition.
     * @function closeSecondaryModal
     * @private
     */
    function closeSecondaryModal() {
        if (elements.secondaryModal) {
            // Clean up toast containers
            const toastContainers = elements.secondaryModal.querySelectorAll(".toast-container");
            toastContainers.forEach(container => container.remove());
                
            elements.secondaryModal.close();
            elements.secondaryModal.classList.add("display-none");
    
            // Check if main modal is still open
            const mainIsStillOpen = elements.mainModal && !elements.mainModal.classList.contains('hidden');
    
            modalStateManager.updateState({
                activeModal: mainIsStillOpen ? 'main' : null,
                isOpen: mainIsStillOpen // false if everything is closed
            });
        }
    }
    
    /**
     * Closes all modals and resets state.
     * @function closeAllModals
     * @private
     */
    function closeAllModals() {
        closeSecondaryModal();
        fermerModal();
        // Clean up toast containers
        const toastContainers = elements.secondaryModal.querySelectorAll(".toast-container");
        toastContainers.forEach(container => container.remove());
        
        // Clear state reset
        modalStateManager.updateState({ isOpen: false, activeModal: null });
    }

    // Configure event listeners
    const eventListeners = [
        { element: elements.btnModifier, event: 'click', handler: openMainModal },
        { element: elements.closeBtn, event: 'click', handler: fermerModal },
        { element: elements.mainModal, event: 'click', handler: (e) => {
            if (e.target === elements.mainModal) fermerModal();
        }},
        { element: elements.openSecondaryBtn, event: 'click', handler: openSecondaryModal },
        { element: elements.closeSecondaryBtn, event: 'click', handler: closeSecondaryModal },
        { element: elements.closeFromSecondary, event: 'click', handler: closeAllModals },
        { element: elements.secondaryModal, event: 'click', handler: (e) => {
            if (e.target === elements.secondaryModal) closeSecondaryModal();}}
    ];

    // Add event listeners
    eventListeners.forEach(({ element, event, handler }) => {
        if (element) element.addEventListener(event, handler);
    });

    // Return public functions
    return {
        openMainModal,
        fermerModal,
    };
}