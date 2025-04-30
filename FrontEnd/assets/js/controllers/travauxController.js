/**
 * Works controller module handling all work-related operations.
 * @module controllers/travauxController
 */

import { fetchTravaux } from '../models/travauxModel.js';
import { renderGalerie } from '../views/galleryView.js';
import { chargerGalerieModal } from '../views/modalView.js';
import { renderCategoryButtons } from '../views/categoryView.js';
import { getUniqueCategories } from '../models/categoryModel.js';
import { uploadWork } from '../models/workUploadModel.js';
import { deleteWorkById } from '../models/deleteModel.js';
import { validerFichierImage } from '../utils/validation.js';
import { afficherImagePreview, fermerSecondaryModal } from "../views/modalView.js"; 
import { modalStateManager } from "../utils/modalState.js"; 
import { Toast } from '../views/toast.js';

/**
 * Initializes works data and renders views.
 * @async
 * @function initTravaux
 * @export
 * @throws {Error} When works initialization fails
 */
export async function initTravaux() {
  try {
    const travaux = await fetchTravaux();
    window.travaux = travaux; 
    window.uniqueCategories = getUniqueCategories(travaux);
    renderGalerie(travaux);
    renderCategoryButtons(travaux, (filtered) => {
      renderGalerie(filtered);
    });

    // If modal is open → reload modal gallery too
    if (modalStateManager.getState().isOpen) {
      chargerGalerieModal(travaux);
    }
  } catch (e) {
    Toast.error('Erreur lors de l\'initialisation des travaux :', e);
  }
}

/**
 * Handles work deletion with confirmation.
 * @async
 * @function confirmerSuppression
 * @export
 * @param {number} workId - ID of the work to delete
 * @throws {Error} When deletion fails
 */
export async function confirmerSuppression(workId) {
  const token = sessionStorage.getItem("token");

  if (!token) {
    Toast.error("Token manquant, action non autorisée");
    return;
  }

  console.log('Token:', token); // Token verification

  try {
    await deleteWorkById(workId, token); // server-side deletion

    // Remove work locally (from window.travaux)
    window.travaux = window.travaux.filter(work => work.id !== workId);

    // Update views with modified local array
    renderGalerie(window.travaux);
    chargerGalerieModal(window.travaux);
    Toast.success("Le travail a bien été supprimé");
    renderCategoryButtons(window.travaux, (filteredWorks) => {
      renderGalerie(filteredWorks);
    });

  } catch (error) {
    Toast.error('Impossible de supprimer l\'image.');
    console.error('Erreur lors de la suppression:', error);
  }
}

/**
 * Handles work upload process.
 * @async
 * @function handleWorkUpload
 * @export
 * @param {HTMLFormElement} formElement - The upload form element
 * @throws {Error} When upload fails
 */
export async function handleWorkUpload(formElement) {
  const formData = new FormData(formElement);
  const token = window.localStorage.getItem('token');

  try {
    const newWork = await uploadWork(formData, token);
    console.log('newWork reçu :', newWork);
  
    if (!newWork) throw new Error('Aucun travail reçu');
  
    Toast.success("✅ Le travail a bien été ajouté !");
  
    setTimeout(() => fermerSecondaryModal(), 1560);
  
    let categoryObj;
    try {
      // Convert categoryId to number for search
      const categoryId = Number(newWork.categoryId);
      
      // Find matching category in existing works
      categoryObj = window.uniqueCategories.find(cat => cat.id === categoryId);
  
      if (!categoryObj) {
        console.error("❌ Impossible de trouver la catégorie pour le nouveau travail.");
        Toast.error("Erreur : catégorie inconnue.");
        return;
      }
  
      // Enrich newWork with found category
      const newWorkWithCategory = {
        ...newWork,
        category: categoryObj
      };
  
      // Add enriched work to window.travaux
      window.travaux.push(newWorkWithCategory);
  
      // 🔁 Re-render views with updated list
      renderGalerie(window.travaux);
      chargerGalerieModal(window.travaux);
      renderCategoryButtons(window.travaux, (filteredWorks) => {
        renderGalerie(filteredWorks);
      });
  
    } catch (innerErr) {
      console.error('Erreur lors de la mise à jour locale :', innerErr);
      Toast.error("⚠️ Erreur dans l'affichage local");
    }
  
    formElement.reset(); // 🧼 Reset form
  
  } catch (err) {
    console.error('Erreur upload:', err);
    Toast.error('❌ Erreur lors de l\'upload du travail');
  }
}

/**
 * Initializes file input validation and preview.
 * @function initFileInput
 * @export
 */
export function initFileInput() {
  const fileInput = document.getElementById("file-input");
  if (fileInput) {
    fileInput.addEventListener("change", (event) => {
      const fichier = event.target.files[0];
      const validation = validerFichierImage(fichier);

      if (!validation.valide) {
        Toast.error(validation.message);
        event.target.value = ""; 
        return;
      }

      afficherImagePreview(fichier);
    });
  }
}

/**
 * Initializes work upload form submission.
 * @function initUploadForm
 * @export
 */
export function initUploadForm() {
  const form = document.getElementById('form-ajout-travail');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleWorkUpload(form);
  });
}

/**
 * Initializes all works-related components.
 * @function initTravauxComponents
 * @export
 */
export function initTravauxComponents() {
  initFileInput();
  initUploadForm();
}

// Initialize components when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initTravauxComponents();
});