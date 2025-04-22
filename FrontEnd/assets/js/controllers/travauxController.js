import { fetchTravaux } from '../models/travauxModel.js';
import { renderGalerie } from '../views/galleryView.js';
import { chargerGalerieModal } from '../views/modalView.js';
import { renderCategoryButtons } from '../views/categoryView.js';
import { uploadWork } from '../models/workUploadModel.js';
import { deleteWorkById } from '../models/deleteModel.js';
import { validerFichierImage } from '../utils/validation.js';
import { afficherMessage, afficherImagePreview, fermerSecondaryModal } from "../views/modalView.js"; 
import { modalStateManager } from "../utils/modalState.js"; // Import du gestionnaire d'état

// Option 1: Continuer à utiliser window.travaux mais avec modalStateManager
export async function initTravaux() {
  try {
    const travaux = await fetchTravaux();
    window.travaux = travaux; // On garde cette approche pour minimiser les changements
    renderGalerie(travaux);
    renderCategoryButtons(travaux, (filtered) => {
      renderGalerie(filtered);
    });

    // Si modale ouverte → recharger aussi la galerie modale
    if (modalStateManager.getState().isOpen) {
      chargerGalerieModal(travaux);
    }
  } catch (e) {
    console.error('Erreur lors de l\'initialisation des travaux :', e);
  }
}

export async function confirmerSuppression(workId) {
  const token = localStorage.getItem("token");
  try {
    await deleteWorkById(workId, token); // suppression sur le serveur

    // Supprimer le travail localement (dans window.travaux)
    window.travaux = window.travaux.filter(work => work.id !== workId);

    // Mettre à jour les vues à partir du tableau local modifié
    renderGalerie(window.travaux);
    chargerGalerieModal(window.travaux);
    renderCategoryButtons(window.travaux, (filteredWorks) => {
      renderGalerie(filteredWorks);
    });

  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
    afficherMessage("Impossible de supprimer l'image.", "error"); // Utilisation de la fonction afficherMessage au lieu d'alert
  }
}

export async function handleWorkUpload(formElement) {
  const formData = new FormData(formElement);
  const token = window.localStorage.getItem('token');

  try {
    const newWork = await uploadWork(formData, token);
    console.log('✅ Nouveau travail ajouté :', newWork);

    if (newWork) {
      afficherMessage("✅ Le travail a bien été ajouté !", "success");

      setTimeout(() => {
        fermerSecondaryModal();
      }, 1560);

      // ➕ Ajouter le nouveau travail localement
      window.travaux.push(newWork);

      // 🔁 Mettre à jour toutes les vues avec le tableau local
      renderGalerie(window.travaux);
      chargerGalerieModal(window.travaux);
      renderCategoryButtons(window.travaux, (filteredWorks) => {
        renderGalerie(filteredWorks);
      });
    }

    formElement.reset(); // 🧼 Réinitialiser le formulaire

  } catch (err) {
    console.error('❌ Erreur upload :', err);
    afficherMessage(err.message || "❌ Une erreur est survenue lors de l'envoi.", "error");
  }
}

// Utilisation d'une fonction pour initialiser les écouteurs liés au fichier
export function initFileInput() {
  const fileInput = document.getElementById("file-input");
  if (fileInput) {
    fileInput.addEventListener("change", (event) => {
      const fichier = event.target.files[0];
      const validation = validerFichierImage(fichier);

      if (!validation.valide) {
        afficherMessage(validation.message, "error");
        event.target.value = ""; 
        return;
      }

      afficherImagePreview(fichier);
    });
  }
}

export function initUploadForm() {
  const form = document.getElementById('form-ajout-travail');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleWorkUpload(form);
  });
}

// Initialisation des composants au chargement du DOM
export function initTravauxComponents() {
  initFileInput();
  initUploadForm();
}

document.addEventListener("DOMContentLoaded", () => {
  initTravauxComponents();
});