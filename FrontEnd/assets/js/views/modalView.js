import { getUniqueCategories } from '../models/categoryModel.js';
import { confirmerSuppression } from '../controllers/travauxController.js';
import { modalStateManager } from '../utils/modalState.js';

export function chargerGalerieModal(data) {
    const modalgalery = document.getElementById("galery-modal");
    
    if (!modalgalery) {
        console.error("Élément galery-modal non trouvé");
        return;
    }
    
    // Vider la galerie avant d'ajouter de nouveaux éléments
    modalgalery.innerHTML = '';
  
    // Vérifier que les données sont valides
    if (!data || !Array.isArray(data) || data.length === 0) {
        const noContent = document.createElement('p');
        noContent.textContent = "Aucun travail disponible";
        noContent.classList.add("no-content-message");
        modalgalery.appendChild(noContent);
        return;
    }

    // Créer les vignettes pour chaque travail
    data.forEach(travail => {
        if (!travail || !travail.id || !travail.imageUrl) return;
        
        const container = document.createElement('div');
        container.classList.add("thumbnail-container");
        container.dataset.id = travail.id;
  
        // Créer l'image miniature
        const img = document.createElement('img');
        img.src = travail.imageUrl;
        img.alt = travail.title || 'Image sans titre';
        img.classList.add("thumbnail");
  
        // Créer l'icône de suppression
        const trash = document.createElement('i');
        trash.className = 'fa-solid fa-trash';
        trash.setAttribute('aria-label', `Supprimer ${travail.title || 'ce travail'}`);
        trash.addEventListener('click', () => {
          confirmerSuppression(travail.id);
      });

  
        // Assembler les éléments
        container.appendChild(img);
        container.appendChild(trash);
        modalgalery.appendChild(container);
    });
    
    // Mettre à jour l'état de la modale si le gestionnaire existe
    if (window.modalManager) {
        window.modalManager.updateModalState({ isLoaded: true });
    }

    renderCategorySelect(data);
}


// Fonction pour mettre à jour les affichages après modification
export function updateModalAfterChange(data) {
    // Mettre à jour la galerie modale
    chargerGalerieModal(data);
    
    // Si une fonction existe pour mettre à jour la vue principale, l'utiliser
    if (window.updateGalleryView && typeof window.updateGalleryView === 'function') {
        window.updateGalleryView(data);
    }
}

// modalviews.js
export function updateWorksGallery(travaux) {
    if (window.updateGalleryView) {
      window.updateGalleryView(travaux);
    }
  }
  
  export function updateModalGallery(travaux) {
    if (typeof chargerGalerieModal === 'function') {
      chargerGalerieModal(travaux);
    }
  }
  

//Fonction d'affichage des categories dans le menu select
export function renderCategorySelect(travaux) {
  const select = document.getElementById('categorie');
  if (!select) {
    console.warn('Le select #categorie est introuvable dans le DOM.');
    return;
  } 

  const uniqueCategories = getUniqueCategories(travaux);

  select.innerHTML = '<option value="">Choisir une catégorie</option>';

  uniqueCategories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    select.appendChild(option);
  });
}


//fonction pour fermer la deuxième modale quand l'upload s'est bien déroulé.
export function fermerSecondaryModal() {
  const secondaryModal = document.getElementById("secondary-modal");
  if (secondaryModal) {
    secondaryModal.close();
    secondaryModal.classList.add("display-none");
    // Supprimer tous les conteneurs de toast dans la modale secondaire
    const toastContainers = secondaryModal.querySelectorAll(".toast-container");
    toastContainers.forEach(container => container.remove());
  }

  // Réinitialiser les champs du formulaire
  const form = secondaryModal.querySelector("form");
  if (form) {
    form.reset();
  }

  // Supprimer l'aperçu du fichier si nécessaire
  const preview = secondaryModal.querySelector(".image-preview");
  if (preview) {
    preview.src = "";
    preview.remove(); 
  }

   // Mettre à jour l'état de la modale dans le gestionnaire d'état
   modalStateManager.updateState({ activeModal: "main" });
}

//Fonction d'affichage de la miniature via l'input file
export function afficherImagePreview(fichier) {
  const reader = new FileReader();

  reader.onload = function(e) {
    const imagePreviewDiv = document.getElementById('image-preview');
    if (!imagePreviewDiv) return;

    imagePreviewDiv.innerHTML = '';
    imagePreviewDiv.classList.add('image-preview-background');

    const img = document.createElement('img');
    img.src = e.target.result;
    img.alt = 'Aperçu de l\'image';
    img.classList.add('image-preview');

    imagePreviewDiv.appendChild(img);
  };

  reader.readAsDataURL(fichier);
}  
