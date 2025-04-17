import { fetchTravaux } from '../models/travauxModel.js';
import { renderGalerie } from '../views/galleryView.js';
import { chargerGalerieModal } from '../views/modalView.js';
import { renderCategoryButtons } from '../views/categoryView.js';


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
