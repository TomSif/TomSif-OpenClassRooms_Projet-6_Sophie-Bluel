/**
 * Modal view module handling all modal-related UI operations.
 * @module views/modalView
 */

import { fetchCategories } from '../models/categoryModel.js';
import { confirmerSuppression } from '../controllers/travauxController.js';
import { modalStateManager } from '../utils/modalState.js';
import { Toast } from './toast.js';

/**
 * Loads and displays works in the modal gallery.
 * @function chargerGalerieModal
 * @export
 * @param {Array} data - Array of work items to display
 * @property {string} data[].id - Work item ID
 * @property {string} data[].imageUrl - URL of the work image
 * @property {string} data[].title - Title of the work
 */
export function chargerGalerieModal(data) {
    const modalgalery = document.getElementById("galery-modal");
    
    if (!modalgalery) {
        Toast.error("Élément galery-modal non trouvé");
        return;
    }
    
    // Clear gallery before adding new elements
    modalgalery.innerHTML = '';
  
    // Validate input data
    if (!data || !Array.isArray(data) || data.length === 0) {
        const noContent = document.createElement('p');
        noContent.textContent = "Aucun travail disponible";
        noContent.classList.add("no-content-message");
        modalgalery.appendChild(noContent);
        return;
    }

    // Create thumbnails for each work item
    data.forEach(travail => {
        if (!travail || !travail.id || !travail.imageUrl) return;
        
        const container = document.createElement('div');
        container.classList.add("thumbnail-container");
        container.dataset.id = travail.id;
  
        // Create thumbnail image
        const img = document.createElement('img');
        const secureImageUrl = travail.imageUrl.replace('http://', 'https://');
        img.src = secureImageUrl;
        img.alt = travail.title || 'Image sans titre';
        img.classList.add("thumbnail");
  
        // Create delete icon
        const trash = document.createElement('i');
        trash.className = 'fa-solid fa-trash';
        trash.setAttribute('aria-label', `Supprimer ${travail.title || 'ce travail'}`);
        trash.addEventListener('click', () => {
          console.log('ID du travail à supprimer:', travail.id);
          confirmerSuppression(travail.id);
      });

        // Assemble elements
        container.appendChild(img);
        container.appendChild(trash);
        modalgalery.appendChild(container);
    });
    
    // Update modal state if manager exists
    if (window.modalManager) {
        window.modalManager.updateModalState({ isLoaded: true });
    }

    renderCategorySelect(data);
}

/**
 * Updates modal display after changes to work items.
 * @function updateModalAfterChange
 * @export
 * @param {Array} data - Updated array of work items
 */
export function updateModalAfterChange(data) {
    // Update modal gallery
    chargerGalerieModal(data);
    
    // Update main gallery view if available
    if (window.updateGalleryView && typeof window.updateGalleryView === 'function') {
        window.updateGalleryView(data);
    }
}

/**
 * Updates the main works gallery view.
 * @function updateWorksGallery
 * @export
 * @param {Array} travaux - Array of work items
 */
export function updateWorksGallery(travaux) {
    if (window.updateGalleryView) {
      window.updateGalleryView(travaux);
    }
}

/**
 * Updates the modal gallery view.
 * @function updateModalGallery
 * @export
 * @param {Array} travaux - Array of work items
 */
export function updateModalGallery(travaux) {
    if (typeof chargerGalerieModal === 'function') {
      chargerGalerieModal(travaux);
    }
}

/**
 * Renders category options in the select dropdown.
 * @async
 * @function renderCategorySelect
 * @export
 */
export async function renderCategorySelect() {
  const select = document.getElementById('categorie');
  if (!select) {
    Toast.error('Le select #categorie est introuvable dans le DOM.');
    return;
  }

  try {
    const categories = await fetchCategories();

    select.innerHTML = '<option value="">Choisir une catégorie</option>';

    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      select.appendChild(option);
    });
  } catch (e) {
    Toast.error('Impossible de charger les catégories dans le formulaire.');
    console.error('Erreur lors du chargement des catégories :', e);
  }
}

/**
 * Closes the secondary modal and resets its state.
 * @function fermerSecondaryModal
 * @export
 */
export function fermerSecondaryModal() {
  const secondaryModal = document.getElementById("secondary-modal");
  if (secondaryModal) {
    secondaryModal.close();
    secondaryModal.classList.add("display-none");
    // Remove all toast containers in secondary modal
    const toastContainers = secondaryModal.querySelectorAll(".toast-container");
    toastContainers.forEach(container => container.remove());
  }

  // Reset form fields
  const form = secondaryModal.querySelector("form");
  if (form) {
    form.reset();
  }

  // Remove file preview if exists
  const preview = secondaryModal.querySelector(".image-preview");
  if (preview) {
    preview.src = "";
    preview.remove(); 
  }

   // Update modal state in state manager
   modalStateManager.updateState({ activeModal: "main" });
}

/**
 * Displays a preview of the selected image file.
 * @function afficherImagePreview
 * @export
 * @param {File} fichier - Image file to preview
 */
export function afficherImagePreview(fichier) {
  const reader = new FileReader();

  reader.onload = function(e) {
    const imagePreviewDiv = document.getElementById('image-preview');
    if (!imagePreviewDiv) return;

    imagePreviewDiv.innerHTML = '';
    imagePreviewDiv.classList.add('image-preview-background');

    const img = document.createElement('img');
    const nomFichier = fichier.name.replace(/\.[^/.]+$/, "");
    img.src = nomFichier;
    img.alt = 'Aperçu de l\'image';
    img.classList.add('image-preview');

    imagePreviewDiv.appendChild(img);

    // Préremplir le champ titre si vide
    const inputTitre = document.getElementById('labelTitle');
    if (inputTitre && inputTitre.value.trim() === '') {
      inputTitre.value = nomFichier;
    }
  };



  reader.readAsDataURL(fichier);
}