import { fetchTravaux } from '../models/travauxModel.js';
import { renderGalerie } from '../views/galleryView.js';
import { chargerGalerieModal } from '../views/modalView.js';
import { renderCategoryButtons } from '../views/categoryView.js';
import { uploadWork } from '../models/workUploadModel.js';
import { deleteWorkById } from '../models/deleteModel.js';
import { validerFichierImage } from '../utils/validation.js';
import { afficherMessage } from "../views/modalView.js"; // Assure-toi que le chemin est correct
import { afficherImagePreview } from '../views/modalView.js'; 
import { fermerSecondaryModal } from "../views/modalView.js";

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


//Fonction pour la suppression des travaux dans la gallerie de la modale
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
    alert("Impossible de supprimer l'image.");
  }
}


export async function handleWorkUpload(formElement) {
  const formData = new FormData(formElement);
  const token = window.localStorage.getItem('token');

  console.log("🔐 Token :", token);
  console.log("📦 FormData :");
  for (let [key, value] of formData.entries()) {
    console.log(`${key} :`, value);
  }

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

    document.dispatchEvent(new CustomEvent("uploadFail"));
  }
}

//fonction pour vérifier le fichier avant de l'uploader
const fileInput = document.getElementById("file-input");
if (fileInput) {
  fileInput.addEventListener("change", (event) => {
  const fichier = event.target.files[0];
  const validation = validerFichierImage(fichier);

  if (!validation.valide) {
    afficherMessage(validation.message, "error"); // Affichage du message d'erreur dans la modale
    event.target.value = ""; // Reset l'input
    return;
  }

  afficherImagePreview(fichier);
})};

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
