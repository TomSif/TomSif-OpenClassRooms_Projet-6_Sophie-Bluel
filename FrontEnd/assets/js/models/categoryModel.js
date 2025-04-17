export function getUniqueCategories(travaux) {
  travaux.forEach(t => {
    if (!t.category || !t.category.id) {
      console.warn("Travail sans catégorie détecté :", t);
    }
  });

  return Array.from(
    new Map(
      travaux
        .filter(t => t.category && t.category.id)
        .map(t => [t.category.id, t.category])
    ).values()
  );
}
