document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const openBtn = document.getElementById('btnModifier');
    const closeBtn = document.getElementById('close-modal');
    
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

    // Fonction pour fermer la modale et réinitialiser son contenu
    function fermerModal() {
        modal.close();
        modal.classList.toggle('hidden');
        updateModalState({ isOpen: false });
        
        // On vide le contenu de la galerie modale après sa fermeture
        window.modalManager.resetGalerieModal();
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

    // // Ajouter un bouton pour l'ajout de nouvelles images
    // const ajouterContainer = document.createElement('div');
    // ajouterContainer.classList.add("thumbnail-container", "add-image-container");
    
    // const ajouterBtn = document.createElement('div');
    // ajouterBtn.classList.add("add-image-btn");
    // ajouterBtn.innerHTML = '<i class="fa-solid fa-plus"></i><span>Ajouter une photo</span>';
    
    // Ajouter l'événement pour ouvrir le formulaire d'ajout
    // ajouterBtn.addEventListener('click', () => {
    //     if (window.ouvrirFormulaireAjout) {
    //         window.ouvrirFormulaireAjout();
    //     }
    // });
    
    // ajouterContainer.appendChild(ajouterBtn);
    // modalgalery.appendChild(ajouterContainer);
}