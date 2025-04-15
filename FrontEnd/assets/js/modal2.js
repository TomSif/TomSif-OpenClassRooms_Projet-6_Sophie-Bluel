// Fonction globale
function fermerModal() {
    const modal = document.getElementById("modal");
    if (modal) {
        modal.close();
        modal.classList.toggle('hidden');
        if (window.modalManager) {
            window.modalManager.updateModalState({ isOpen: false });
            window.modalManager.resetGalerieModal();
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const openBtn = document.getElementById('btnModifier');
    const closeBtn = document.getElementById('close-modal');
    const closeSdeBtn = document.getElementById('close-main-modal-from-secondary');
    
    // État de la modale
    let modalState = {
        isOpen: false,
        isLoaded: false
    };

    // Fonction pour gérer l'état de la modale
    function updateModalState(newState) {
        modalState = { ...modalState, ...newState };
        
        // Si la modale est ouverte et que les images n'ont pas été chargées
        if (modalState.isOpen && !modalState.isLoaded) {
            chargerGalerieModal(window.travaux); // On utilise les travaux stockés globalement
            modalState.isLoaded = true;
        }
    }

    // Événement d'ouverture de la modale
    openBtn.addEventListener('click', () => {
        modal.showModal();
        modal.classList.toggle('hidden');
        updateModalState({ isOpen: true });
    });
  
    // Événement de fermeture de la modale avec le bouton
    closeBtn.addEventListener('click', () => {
        fermerModal();
    });


    // Événement de fermeture de la modale en cliquant à l'extérieur
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            fermerModal();
        }
    });

    // Exposition de l'API pour la communication entre fichiers
    window.modalManager = {
        updateModalState,
        getState: () => modalState,
        resetGalerieModal: () => {
            const modalgalery = document.getElementById("galery-modal");
            modalgalery.innerHTML = '';
            updateModalState({ isLoaded: false });
        }
    };
});

// Fonction pour charger la galerie de la modale
function chargerGalerieModal(data) {
    const modalgalery = document.getElementById("galery-modal");
    modalgalery.innerHTML = ''; // Vide la modale avant d'ajouter de nouveaux éléments

    // Parcours chaque élément dans le tableau de données
    data.forEach(travail => {
        // Crée un conteneur pour l'image et l'icône
        const container = document.createElement('div');
        container.classList.add("thumbnail-container");
        container.dataset.id = travail.id; // Stocke l'ID pour les actions futures

        // Crée l'élément image
        const imgModal = document.createElement('img');
        imgModal.src = travail.imageUrl;
        imgModal.alt = travail.title;
        imgModal.classList.add("thumbnail");

        // Crée l'icône de suppression
        const icone = document.createElement('i');
        icone.className = 'fa-solid fa-trash';
        
        // Ajoute l'événement de suppression
        icone.addEventListener('click', (e) => {
            e.stopPropagation(); // Empêche la propagation de l'événement
            if (window.confirmerSuppression) {
                window.confirmerSuppression(travail.id);
            }
        });

        // Ajoute l'image et l'icône au conteneur
        container.appendChild(imgModal);
        container.appendChild(icone);

        // Ajoute le conteneur à la galerie modale
        modalgalery.appendChild(container);
    });
}

    //fonction pour deuxième modale
    const secondaryModal = document.getElementById('secondary-modal');
    const closeSecondaryBtn = document.getElementById('close-secondary-modal');
    const openSecondaryBtn = document.getElementById('open-secondary');
    const closePrimary = document.getElementById('close-main-modal-from-secondary');

    // Ouvrir la modale secondaire depuis la principale
    openSecondaryBtn.addEventListener('click', () => {
        secondaryModal.classList.toggle("display-none");
        secondaryModal.showModal();
  });
  
  // Fermer la modale secondaire
    closeSecondaryBtn.addEventListener('click', () => {
    secondaryModal.close();
    secondaryModal.classList.toggle("display-none");
  });

    closePrimary.addEventListener('click', () => {
        secondaryModal.close();
        fermerModal();
        console.log('le bouton est clické');
  });
