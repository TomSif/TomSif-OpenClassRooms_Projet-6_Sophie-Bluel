const apiUrl = 'http://localhost:5678/api/works';  // Ton URL API

let travaux = []; // Variable pour stocker les travaux récupérés

// Fonction pour récupérer les travaux et afficher la galerie
function getTravaux() {
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {  // Vérifie si la réponse est correcte (status 200)
        throw new Error('Erreur lors de la récupération des travaux');
      }
      return response.json();  // Convertir la réponse en JSON
    })
    .then(data => {
      travaux = data;  // Sauvegarder les travaux récupérés
      afficherCategories();  // Afficher les catégories dans le menu de sélection
      afficherTravaux(travaux);  // Afficher tous les travaux par défaut
    })
    .catch(error => {
      console.error('Il y a eu une erreur :', error);
    });
}

// Fonction pour afficher les travaux dans le DOM
function afficherTravaux(data) {
  const galerieContainer = document.querySelector('.gallery');  // Sélectionne le conteneur de la galerie
  galerieContainer.innerHTML = '';  // Vide la galerie avant d'ajouter de nouveaux éléments

  // Parcours chaque élément dans le tableau de données
  data.forEach(travail => {
    const figure = document.createElement('figure');  // Crée un élément <figure>
    
    const img = document.createElement('img');  // Crée l'élément <img>
    img.src = travail.imageUrl;  // Utilise "imageUrl" pour définir la source de l'image
    img.alt = travail.title;  // Utilise le titre du travail comme texte alternatif pour l'image
    
    const caption = document.createElement('figcaption');  // Crée l'élément <figcaption>
    caption.textContent = travail.title;  // Définir le texte du titre
    
    // Ajoute l'image et la légende dans l'élément <figure>
    figure.appendChild(img);
    figure.appendChild(caption);
    
    // Ajoute l'élément <figure> dans le conteneur de la galerie
    galerieContainer.appendChild(figure);
  });
}

function afficherCategories() {
  const categoriesSet = new Set();  // Utiliser un Set pour éviter les doublons

  travaux.forEach(travail => {
    categoriesSet.add(travail.category.id);  // Ajouter l'ID de chaque catégorie unique au Set
  });

  const menuCategories = document.querySelector('#menu-categories');

  // Ajouter le bouton "Tous les travaux" comme un bouton reset
  const resetButton = document.createElement('button');
  resetButton.classList.add('category-button');
  resetButton.textContent = 'Tous';

  // Événement de clic pour réinitialiser et afficher tous les travaux
  resetButton.addEventListener('click', function() {
    afficherTravaux(travaux);  // Afficher tous les travaux sans filtre
    activerBouton(resetButton);
  });

  // Ajouter le bouton de reset dans le menu
  menuCategories.appendChild(resetButton);

  // Ajouter un bouton pour chaque catégorie dans le menu
  categoriesSet.forEach(categoryId => {
    const category = travaux.find(travail => travail.category.id === categoryId).category;  // Trouver la catégorie par son ID
    
    const button = document.createElement('button');  // Créer un bouton pour chaque catégorie
    button.classList.add('category-button');
    button.dataset.categoryId = category.id;  // Attribuer l'ID de la catégorie au bouton
    button.textContent = category.name;  // Le nom de la catégorie

    // Ajouter l'événement de clic pour filtrer les travaux en fonction de la catégorie
    button.addEventListener('click', function() {
      const filteredTravaux = travaux.filter(travail => travail.category.id === category.id);
      afficherTravaux(filteredTravaux);  // Afficher les travaux filtrés
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

// Appel de la fonction pour récupérer les travaux et mettre à jour la galerie
getTravaux();
