import { getUniqueCategories } from '../models/categoryModel.js';

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
        trash.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.confirmerSuppression) {
                window.confirmerSuppression(travail.id);
            }
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

// Fonction pour activer/désactiver le mode édition
export function toggleEditMode(activate = true) {
    const btnModifier = document.getElementById('btnModifier');
    const banner = document.getElementById('banner');
    
    if (activate) {
        // Activer le mode édition
        if (btnModifier) btnModifier.classList.remove('display-none');
        if (banner) banner.classList.remove('display-none');
    } else {
        // Désactiver le mode édition
        if (btnModifier) btnModifier.classList.add('display-none');
        if (banner) banner.classList.add('display-none');
    }
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
    console.log('renderCategorySelect appelée avec :', travaux); // ← DEBUG 
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

//fonction d'affichage d'un message de succès à l'upload
export function afficherMessageUploadSucces() {
  const message = document.createElement("p");
  message.textContent = "✅ Le travail a bien été ajouté !";
  message.style.color = "green";
  message.style.textAlign = "center";

  const container = document.querySelector(".secondary-modal-title");
  if (container) {
    container.appendChild(message);
    setTimeout(() => {
      message.remove();
    }, 1500);
  }
}

//fonction d'affichage d'un message d'échec à l'upload
export function afficherMessageUploadErreur() {
  const message = document.createElement("p");
  message.textContent = "❌ Une erreur est survenue lors de l'ajout.";
  message.style.color = "red";
  message.style.textAlign = "center";

  const container = document.querySelector(".secondary-modal-title");
  if (container) {
    container.appendChild(message);
    setTimeout(() => {
      message.remove();
    }, 3000);
  }
}

//fonction pour fermer la deuxième modale quand l'upload s'est bien déroulé.
export function fermerSecondaryModal() {
  const secondaryModal = document.getElementById("secondary-modal");
  if (secondaryModal) {
    secondaryModal.close();
    secondaryModal.classList.add("display-none");
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
  }
}

//Fonction d'affichage de la miniature via l'input file
const fileInput = document.getElementById('file-input');

if (fileInput) {
  fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0]; // Premier fichier sélectionné
    if (file) {
      const reader = new FileReader();

      reader.onload = function(e) {
        const imagePreviewDiv = document.getElementById('image-preview');
        if (!imagePreviewDiv) return; // sécurité en plus

        imagePreviewDiv.innerHTML = ''; // Vide le div
        imagePreviewDiv.classList.add('image-preview-background');

        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'Aperçu de l\'image';
        img.style.maxWidth = '100%';
        img.classList.add('image-preview');

        imagePreviewDiv.appendChild(img);
      };

      reader.readAsDataURL(file);
    }
  });
}
  