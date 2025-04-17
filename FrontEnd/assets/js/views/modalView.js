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
  