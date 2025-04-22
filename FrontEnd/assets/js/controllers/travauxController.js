import { fetchTravaux } from '../models/travauxModel.js';
import { renderGalerie } from '../views/galleryView.js';
import { chargerGalerieModal } from '../views/modalView.js';
import { renderCategoryButtons } from '../views/categoryView.js';
import { uploadWork } from '../models/workUploadModel.js';
import { deleteWorkById } from '../models/deleteModel.js';
import { validerFichierImage } from '../utils/validation.js';
import { afficherImagePreview, fermerSecondaryModal } from "../views/modalView.js"; 
import { modalStateManager } from "../utils/modalState.js"; 
import { Toast } from '../views/toast.js';

export async function initTravaux() {
  try {
    const travaux = await fetchTravaux();
    window.travaux = travaux; 
    renderGalerie(travaux);
    renderCategoryButtons(travaux, (filtered) => {
      renderGalerie(filtered);
    });

    // Si modale ouverte → recharger aussi la galerie modale
    if (modalStateManager.getState().isOpen) {
      chargerGalerieModal(travaux);
    }
  } catch (e) {
    Toast.error('Erreur lors de l\'initialisation des travaux :', e);
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
    Toast.success("le travail a bien été supprimé");
    renderCategoryButtons(window.travaux, (filteredWorks) => {
      renderGalerie(filteredWorks);
    });

  } catch (error) {
    Toast.error('Impossible de supprimer l\'image.');
  }
}

export async function handleWorkUpload(formElement) {
  const formData = new FormData(formElement);
  const token = window.localStorage.getItem('token');

  try {
    const newWork = await uploadWork(formData, token);

    if (newWork) {
      Toast.success("✅ Le travail a bien été ajouté !");

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
    Toast.error('❌ Erreur lors de l’upload du travail ');
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
        Toast.error(validation.message);
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