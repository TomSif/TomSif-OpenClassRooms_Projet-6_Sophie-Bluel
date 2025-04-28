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

export async function initTravaux() {
  try {
    const travaux = await fetchTravaux();
    window.travaux = travaux; 
    window.uniqueCategories = getUniqueCategories(travaux);
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
  const token = sessionStorage.getItem("token");

  if (!token) {
    Toast.error("Token manquant, action non autorisée");
    return;
  }

  console.log('Token:', token); // Vérification du token

  try {
    await deleteWorkById(workId, token); // suppression sur le serveur

    // Supprimer le travail localement (dans window.travaux)
    window.travaux = window.travaux.filter(work => work.id !== workId);

    // Mettre à jour les vues à partir du tableau local modifié
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
      // Convertir categoryId en number pour la recherche
      const categoryId = Number(newWork.categoryId);
      
      // Trouver la catégorie correspondant à categoryId dans les travaux existants
      categoryObj = window.uniqueCategories.find(cat => cat.id === categoryId);
  
      if (!categoryObj) {
        console.error("❌ Impossible de trouver la catégorie pour le nouveau travail.");
        Toast.error("Erreur : catégorie inconnue.");
        return;
      }
  
      // Enrichir newWork avec la catégorie trouvée
      const newWorkWithCategory = {
        ...newWork,
        category: categoryObj
      };
  
      // Ajouter le nouveau travail enrichi à window.travaux
      window.travaux.push(newWorkWithCategory);
  
      // 🔁 Re-render des vues avec la nouvelle liste
      renderGalerie(window.travaux);
      chargerGalerieModal(window.travaux);
      renderCategoryButtons(window.travaux, (filteredWorks) => {
        renderGalerie(filteredWorks);
      });
  
    } catch (innerErr) {
      console.error('Erreur lors de la mise à jour locale :', innerErr);
      Toast.error("⚠️ Erreur dans l’affichage local");
    }
  
    formElement.reset(); // 🧼 Réinitialiser le formulaire
  
  } catch (err) {
    console.error('Erreur upload:', err);
    Toast.error('❌ Erreur lors de l’upload du travail');
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