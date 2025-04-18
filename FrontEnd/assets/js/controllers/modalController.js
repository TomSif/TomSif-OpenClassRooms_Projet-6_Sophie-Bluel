import { chargerGalerieModal } from '../views/modalView.js';
import { deleteWorkById } from '../models/deleteModel.js';
import { updateWorksGallery, updateModalGallery } from '../views/modalView.js';


export function setupModalButtons() {
    const mainModal = document.getElementById('modal');
    const secondaryModal = document.getElementById('secondary-modal');
    const openSecondaryBtn = document.getElementById('open-secondary');
    const closeSecondaryBtn = document.getElementById('close-secondary-modal');
    const closeFromSecondary = document.getElementById('close-main-modal-from-secondary');
    const btnModifier = document.getElementById('btnModifier');
    const banner = document.getElementById('banner'); 
    const loginButton = document.getElementById('login');
    const closeBtn = document.getElementById('close-modal');

    console.log('✅ setupModalButtons initialisé');

    // Fonction pour gérer l'ouverture de la première modale
    function openMainModal() {
        if (!mainModal) return;
        
        mainModal.showModal();
        mainModal.classList.remove('hidden');
        
        // Si la galerie n'a pas encore été chargée dans la modale
        if (window.travaux && window.modalManager && !window.modalManager.getState()?.isLoaded) {
            chargerGalerieModal(window.travaux);
            if (window.modalManager) {
                window.modalManager.updateModalState({ isOpen: true, isLoaded: true });
            }
        }
    }

    // Fonction pour fermer la modale principale
    function fermerModal() {
        if (!mainModal) return;
        
        mainModal.close();
        mainModal.classList.add('hidden');
        
        if (window.modalManager) {
            window.modalManager.updateModalState({ isOpen: false });
            window.modalManager.resetGalerieModal();
        }
    }

    // Initialisation des écouteurs d'événements pour les boutons
    if (btnModifier) {
        btnModifier.addEventListener('click', openMainModal);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', fermerModal);
    }

    if (mainModal) {
        mainModal.addEventListener('click', (e) => {
            if (e.target === mainModal) {
                fermerModal();
            }
        });
    }

    if (openSecondaryBtn) {
        openSecondaryBtn.addEventListener('click', () => {
            if (secondaryModal) {
                secondaryModal.classList.remove("display-none");
                secondaryModal.showModal();
            }
        });
    }

    if (closeSecondaryBtn) {
        closeSecondaryBtn.addEventListener('click', () => {
            if (secondaryModal) {
                secondaryModal.close();
                secondaryModal.classList.add("display-none");
            }
        });
    }

    if (closeFromSecondary) {
        closeFromSecondary.addEventListener('click', () => {
            if (secondaryModal) {
                secondaryModal.close();
                secondaryModal.classList.add("display-none");
            }
            fermerModal();
        });
    }

    // Initialisation du gestionnaire d'état des modales
    if (!window.modalManager) {
        let modalState = {
            isOpen: false,
            isLoaded: false
        };

        window.modalManager = {
            updateModalState: (newState) => {
                modalState = { ...modalState, ...newState };
                return modalState;
            },
            getState: () => modalState,
            resetGalerieModal: () => {
                const modalgalery = document.getElementById("galery-modal");
                if (modalgalery) modalgalery.innerHTML = '';
                modalState.isLoaded = false;
            }
        };
    }

    // Gestion de l'authentification et du mode édition
    function setupAuthenticationUI() {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        
        if (isAdmin) {
            // Afficher la bannière admin et le bouton modifier
            if (banner) banner.classList.remove('display-none');
            if (btnModifier) btnModifier.classList.remove('display-none');
            
            // Changer le bouton login en bouton logout
            if (loginButton) {
                loginButton.textContent = 'Logout';
                loginButton.href = '#';
                
                // Éviter les doublons d'écouteurs d'événements
                const newLoginButton = loginButton.cloneNode(true);
                if (loginButton.parentNode) {
                    loginButton.parentNode.replaceChild(newLoginButton, loginButton);
                }
                
                newLoginButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Déconnexion
                    localStorage.removeItem('token');
                    localStorage.removeItem('isAdmin');
                    
                    // Masquer les éléments d'édition
                    if (btnModifier) btnModifier.classList.add('display-none');
                    if (banner) banner.classList.add('display-none');
                    
                    // Recharger la page pour réinitialiser l'interface
                    window.location.reload();
                });
            }
        } else {
            // S'assurer que les éléments d'édition sont masqués
            if (btnModifier) btnModifier.classList.add('display-none');
            if (banner) banner.classList.add('display-none');
        }
    }

    // Initialiser la gestion de l'authentification
    setupAuthenticationUI();

    return {
        openMainModal,
        fermerModal,
        setupAuthenticationUI
    };
}

export function confirmerSuppression(travauxId) {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('Token non disponible, authentification requise');
      return;
    }
  
    if (confirm(`Voulez-vous vraiment supprimer cet élément ?`)) {
      deleteWorkById(travauxId, token)
        .then(() => {
          if (window.travaux) {
            window.travaux = window.travaux.filter(item => item.id !== parseInt(travauxId));
  
            updateWorksGallery(window.travaux);
            updateModalGallery(window.travaux);
          }
        })
        .catch(error => {
          console.error('Erreur de suppression :', error);
          alert('La suppression a échoué');
        });
    }
  }
  
  