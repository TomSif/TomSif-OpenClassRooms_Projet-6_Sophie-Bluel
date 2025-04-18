// categoryModel.js

// Extrait uniquement les catégories valides depuis les travaux
export function getUniqueCategories(travaux) {
  return Array.from(
    new Map(
      travaux
        .filter(t => t.categoryId && t.category) // sécurité en cas de doublons
        .map(t => [t.category.id, t.category])
    ).values()
  );
}

// Transforme les catégories en format minimal requis par le POST
export function formatCategoryForPost(category) {
  if (typeof category === 'string') {
    return category; // déjà au bon format
  }
  if (category && category.id) {
    return category.id; // on extrait simplement l'id
  }
  console.warn("Catégorie mal formée pour le POST :", category);
  return null;
}
