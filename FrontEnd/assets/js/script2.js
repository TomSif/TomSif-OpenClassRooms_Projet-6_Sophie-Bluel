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

//fonction de gestion des fonctions du login
document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('banner');
    const loginButton = document.getElementById('login');
    const openBtn = document.getElementById('btnModifier');
    
    // Vérifier si l'utilisateur est connecté en admin
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (isAdmin) {
      // Afficher la bannière admin
      banner.classList.remove('display-none');
      openBtn.classList.remove('display-none');
      
      
      // Facultatif : changer le bouton login en bouton logout
      if (loginButton) {
        loginButton.textContent = 'Logout';
        loginButton.href = '#'; // Enlever le lien vers la page login
        loginButton.addEventListener('click', (e) => {
          e.preventDefault();
          // Déconnexion : supprimer les données du localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('isAdmin');
          openBtn.classList.add('display-none');
          // Recharger la page pour rafraîchir l'interface
          window.location.reload();
        });
      }
    }});
  
// Appel de la fonction pour récupérer les travaux et mettre à jour la galerie
getTravaux();