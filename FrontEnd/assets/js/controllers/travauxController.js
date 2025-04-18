import { fetchTravaux } from '../models/travauxModel.js';
import { renderGalerie } from '../views/galleryView.js';
import { chargerGalerieModal } from '../views/modalView.js';
import { renderCategoryButtons } from '../views/categoryView.js';
import { uploadWork } from '../models/workUploadModel.js';
import { afficherMessageUploadSucces, afficherMessageUploadErreur, fermerSecondaryModal } from "../views/modalView.js";

export async function initTravaux() {
  try {
    const travaux = await fetchTravaux();
    window.travaux = travaux;
    renderGalerie(travaux);
    renderCategoryButtons(travaux, (filtered) => {
      renderGalerie(filtered);
    });

    // Si modale ouverte → recharger aussi la galerie modale
    if (window.modalManager?.getState().isOpen) {
      chargerGalerieModal(travaux);
    }
  } catch (e) {
    console.error('Erreur lors de l\'initialisation des travaux :', e);
  }
}

export async function handleWorkUpload(formElement) {
  const formData = new FormData(formElement);
  const token = window.localStorage.getItem('token');

  // 🔍 Debug logs
  console.log("🔐 Token :", token);
  console.log("📦 FormData :");
  for (let [key, value] of formData.entries()) {
    console.log(`${key} :`, value);
  }

  try {
    const newWork = await uploadWork(formData, token);
    console.log('✅ Nouveau travail ajouté :', newWork);

    if (newWork) {
      // 🔔 Événement personnalisé (upload réussi)
      afficherMessageUploadSucces(); 
      // ⏱️ Fermer la modale secondaire après un petit délai
      setTimeout(() => {
      fermerSecondaryModal();
      }, 1560);
    }

    // 🔄 Rafraîchir toutes les galeries avec les données complètes depuis l'API
    const refreshedTravaux = await fetchTravaux();
    window.travaux = refreshedTravaux;
    renderGalerie(refreshedTravaux);
    chargerGalerieModal(refreshedTravaux);

    // 🔁 Mettre à jour les boutons de filtres
    renderCategoryButtons(refreshedTravaux, (filtered) => {
      renderGalerie(filtered);
    });


    formElement.reset(); // Réinitialise le formulaire
  } catch (err) {
    console.error('❌ Erreur lors de l’ajout du travail :', err);
    alert(err.message || "Une erreur est survenue.");
    afficherMessageUploadErreur(); // 🔔 Message erreur
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

document.addEventListener("DOMContentLoaded", () => {
  initUploadForm();
});
