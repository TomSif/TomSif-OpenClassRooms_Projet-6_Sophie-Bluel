const apiUrl = 'http://localhost:5678/api/works';
window.travaux = []; // Variable pour stocker les travaux récupérés (accessible globalement)

// Fonction pour récupérer les travaux et afficher la galerie
function getTravaux() {
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des travaux');
      }
      return response.json();
    })
    .then(data => {
      window.travaux = data;  // Sauvegarder les travaux récupérés
      afficherCategories();  // Afficher les catégories dans le menu de sélection
      afficherGaleriePrincipale(window.travaux);  // Afficher tous les travaux dans la galerie principale
      
      // Si la modale est ouverte, on met à jour sa galerie aussi
      if (window.modalManager && window.modalManager.getState().isOpen) {
        chargerGalerieModal(window.travaux);
      }
    })
    .catch(error => {
      console.error('Il y a eu une erreur :', error);
    });
}

// Fonction pour afficher les travaux dans la galerie principale
function afficherGaleriePrincipale(data) {
  const galerieContainer = document.querySelector('.gallery');
  galerieContainer.innerHTML = '';  // Vide la galerie avant d'ajouter de nouveaux éléments

  // Parcours chaque élément dans le tableau de données
  data.forEach(travail => {
    // Crée un élément <figure> pour la galerie principale
    const figureGalerie = document.createElement('figure');
    const imgGalerie = document.createElement('img');
    imgGalerie.src = travail.imageUrl;
    imgGalerie.alt = travail.title;
    const captionGalerie = document.createElement('figcaption');
    captionGalerie.textContent = travail.title;
    figureGalerie.appendChild(imgGalerie);
    figureGalerie.appendChild(captionGalerie);
    galerieContainer.appendChild(figureGalerie);
  });
}

// Fonction pour afficher les catégories avec les filtres
function afficherCategories() {
  const categoriesSet = new Set();  // Utiliser un Set pour éviter les doublons

  window.travaux.forEach(travail => {
    categoriesSet.add(travail.category.id);  // Ajouter l'ID de chaque catégorie unique au Set
  });

  const menuCategories = document.querySelector('#menu-categories');
  menuCategories.innerHTML = ''; // Vider le menu avant de le reconstruire

  // Ajouter le bouton "Tous les travaux" comme un bouton reset
  const resetButton = document.createElement('button');
  resetButton.classList.add('category-button');
  resetButton.textContent = 'Tous';

  // Événement de clic pour réinitialiser et afficher tous les travaux
  resetButton.addEventListener('click', function() {
    afficherGaleriePrincipale(window.travaux);  // Afficher tous les travaux sans filtre
    activerBouton(resetButton);
  });

  // Ajouter le bouton de reset dans le menu
  menuCategories.appendChild(resetButton);

  // Ajouter un bouton pour chaque catégorie dans le menu
  categoriesSet.forEach(categoryId => {
    const category = window.travaux.find(travail => travail.category.id === categoryId).category;  // Trouver la catégorie par son ID
    
    const button = document.createElement('button');  // Créer un bouton pour chaque catégorie
    button.classList.add('category-button');
    button.dataset.categoryId = category.id;  // Attribuer l'ID de la catégorie au bouton
    button.textContent = category.name;  // Le nom de la catégorie

    // Ajouter l'événement de clic pour filtrer les travaux en fonction de la catégorie
    button.addEventListener('click', function() {
      const filteredTravaux = window.travaux.filter(travail => travail.category.id === category.id);
      afficherGaleriePrincipale(filteredTravaux);  // Afficher les travaux filtrés
      activerBouton(button);
    });

    // Ajouter le bouton dans le menu
    menuCategories.appendChild(button);
  });

  // Activer par défaut le bouton "Tous"
  activerBouton(resetButton);
}

// Fonction pour activer visuellement un bouton et désactiver les autres
function activerBouton(boutonActif) {
  document.querySelectorAll('.category-button').forEach(button => {
    button.classList.remove('category-button-active');
  });
  boutonActif.classList.add('category-button-active');
}

// Fonction pour confirmer et exécuter la suppression d'un travail
function confirmerSuppression(id) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer cette œuvre ?`)) {
    supprimerTravail(id);
  }
}

// Fonction pour supprimer un travail via l'API
function supprimerTravail(id) {
  // Récupérer le token d'authentification depuis le localStorage
  const token = localStorage.getItem('token');
  
  if (!token) {
    alert('Vous devez être connecté pour effectuer cette action');
    return;
  }

  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression');
    }
    
    // Mise à jour locale des données après suppression réussie
    window.travaux = window.travaux.filter(travail => travail.id !== id);
    
    // Mettre à jour la galerie principale
    afficherGaleriePrincipale(window.travaux);
    
    // Mettre à jour la galerie de la modale si elle est ouverte
    if (window.modalManager && window.modalManager.getState().isOpen) {
      chargerGalerieModal(window.travaux);
    }
  })
  .catch(error => {
    console.error('Erreur lors de la suppression :', error);
    alert('Une erreur est survenue lors de la suppression');
  });
}

// Fonction pour ouvrir le formulaire d'ajout (à développer)
function ouvrirFormulaireAjout() {
  // Logique pour afficher le formulaire d'ajout
  console.log('Ouverture du formulaire d\'ajout');
  // Vous pourriez ici basculer vers une autre vue de la modale, etc.
}

// Fonction pour ajouter un nouveau travail
function ajouterTravail(formData) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    alert('Vous devez être connecté pour effectuer cette action');
    return Promise.reject('Non authentifié');
  }

  return fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData // FormData contenant title, category et image
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout');
    }
    return response.json();
  })
  .then(nouveauTravail => {
    // Ajouter le nouveau travail à notre liste locale
    window.travaux.push(nouveauTravail);
    
    // Mettre à jour la galerie principale
    afficherGaleriePrincipale(window.travaux);
    
    // Mettre à jour la galerie de la modale si elle est ouverte
    if (window.modalManager && window.modalManager.getState().isOpen) {
      chargerGalerieModal(window.travaux);
    }
    
    return nouveauTravail;
  });
}

// Exposer les fonctions pour qu'elles soient accessibles depuis modal.js
window.confirmerSuppression = confirmerSuppression;
window.ouvrirFormulaireAjout = ouvrirFormulaireAjout;
window.ajouterTravail = ajouterTravail;

// Appel de la fonction pour récupérer les travaux et mettre à jour la galerie
getTravaux();