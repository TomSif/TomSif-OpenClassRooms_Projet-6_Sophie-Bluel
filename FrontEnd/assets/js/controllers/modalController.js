import { chargerGalerieModal } from '../views/modalView.js';
import { modalStateManager } from '../utils/modalState.js'; 
export function setupModalButtons() {
    // Regrouper toutes les sélections DOM
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

    // Fonctions principales
    function openMainModal() {
        if (!elements.mainModal) return;
        
        elements.mainModal.showModal();
        elements.mainModal.classList.remove('hidden');
        
        if (window.travaux && !modalStateManager.getState().isLoaded) {
            chargerGalerieModal(window.travaux);
            modalStateManager.updateState({ isOpen: true, isLoaded: true });
        }
    }

    function fermerModal() {
        if (!elements.mainModal) return;
        
        elements.mainModal.close();
        elements.mainModal.classList.add('hidden');
        
        modalStateManager.updateState({ isOpen: false });
        modalStateManager.resetGalerie();
    }

    function openSecondaryModal() {
        if (elements.secondaryModal) {
            elements.secondaryModal.classList.remove("display-none");
            elements.secondaryModal.showModal();
        }
    }

    function closeSecondaryModal() {
        if (elements.secondaryModal) {
            elements.secondaryModal.close();
            elements.secondaryModal.classList.add("display-none");
        }
    }

    function closeAllModals() {
        closeSecondaryModal();
        fermerModal();
    }

    function handleLogout(e) {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        
        if (elements.btnModifier) elements.btnModifier.classList.add('display-none');
        if (elements.banner) elements.banner.classList.add('display-none');
        
        window.location.reload();
    }

    // Configuration des écouteurs d'événements
    const eventListeners = [
        { element: elements.btnModifier, event: 'click', handler: openMainModal },
        { element: elements.closeBtn, event: 'click', handler: fermerModal },
        { element: elements.mainModal, event: 'click', handler: (e) => {
            if (e.target === elements.mainModal) fermerModal();
        }},
        { element: elements.openSecondaryBtn, event: 'click', handler: openSecondaryModal },
        { element: elements.closeSecondaryBtn, event: 'click', handler: closeSecondaryModal },
        { element: elements.closeFromSecondary, event: 'click', handler: closeAllModals }
    ];

    // Ajouter les écouteurs d'événements
    eventListeners.forEach(({ element, event, handler }) => {
        if (element) element.addEventListener(event, handler);
    });

    // Configuration de l'interface utilisateur en fonction de l'authentification
    function setupAuthenticationUI() {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        
        if (isAdmin) {
            if (elements.banner) elements.banner.classList.remove('display-none');
            if (elements.btnModifier) elements.btnModifier.classList.remove('display-none');
            
            if (elements.loginButton) {
                elements.loginButton.textContent = 'Logout';
                elements.loginButton.href = '#';
                
                // Éviter les écouteurs multiples
                const newLoginButton = elements.loginButton.cloneNode(true);
                if (elements.loginButton.parentNode) {
                    elements.loginButton.parentNode.replaceChild(newLoginButton, elements.loginButton);
                }
                elements.loginButton = newLoginButton;
                elements.loginButton.addEventListener('click', handleLogout);
            }
        } else {
            if (elements.btnModifier) elements.btnModifier.classList.add('display-none');
            if (elements.banner) elements.banner.classList.add('display-none');
        }
    }

    // Initialiser l'UI d'authentification
    setupAuthenticationUI();

    // Retourner les fonctions publiques
    return {
        openMainModal,
        fermerModal,
        setupAuthenticationUI
    };
}