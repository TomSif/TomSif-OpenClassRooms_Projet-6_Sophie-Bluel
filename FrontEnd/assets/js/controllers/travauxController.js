import { fetchTravaux } from '../models/travauxModel.js';
import { renderGalerie } from '../views/galleryView.js';
import { chargerGalerieModal } from '../views/modalView.js';
import { renderCategoryButtons } from '../views/categoryView.js';
import { uploadWork } from '../models/workUploadModel.js';

// Initialisation de la variable uploadSuccessful à false
let uploadSuccessful = false;

export async function initTravaux() {
  try {
    const travaux = await fetchTravaux();
    window.travaux = travaux;
    renderGalerie(travaux);
    renderCategoryButtons(travaux, (filtered) => {
        renderGalerie(filtered);
      });

    // Met à jour la modale si elle est ouverte
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

  // 🔎 Debug log AVANT l'envoi à l'API
  console.log("🔐 Token :", token);
  console.log("📦 Contenu du FormData :");
  for (let [key, value] of formData.entries()) {
    console.log(`${key} :`, value);
  }

  try {
    const newWork = await uploadWork(formData, token);
    console.log('Nouveau travail ajouté :', newWork);

    if (newWork) {
      // 🔔 Émet un événement DOM personnalisé à succès
      document.dispatchEvent(new CustomEvent("uploadSuccess", {
        detail: { work: newWork }
      }));
    }

    // Ajoute le nouveau travail à la liste et met à jour l'affichage
    window.travaux.push(newWork);
    chargerGalerieModal(window.travaux);
    if (window.updateGalleryView) {
      window.updateGalleryView(window.travaux);
    }

    formElement.reset(); // Réinitialise le formulaire
  } catch (err) {
    console.error('Erreur lors de l’ajout du travail :', err);
    alert(err.message || "Une erreur est survenue.");

    // 🔔 Émet aussi un événement d'erreur si besoin
    document.dispatchEvent(new CustomEvent("uploadFail"));
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
