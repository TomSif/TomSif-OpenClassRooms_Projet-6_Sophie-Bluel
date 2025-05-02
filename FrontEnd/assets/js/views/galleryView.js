/**
 * Gallery view module handling the rendering of work items.
 * @module views/galleryView
 */

/**
 * Renders a gallery of work items in the DOM.
 * @function renderGalerie
 * @export
 * @param {Array} travaux - Array of work items to render
 * @property {string} travaux[].imageUrl - URL of the work image
 * @property {string} travaux[].title - Title of the work
 */

export function renderGalerie(travaux) {
  const container = document.querySelector('.gallery');
  container.innerHTML = '';
  travaux.forEach(travail => {
    const secureImageUrl = travail.imageUrl.replace('http://', 'https://');
    const figure = document.createElement('figure');
    figure.innerHTML = `
      <img src="${secureImageUrl}" alt="${travail.title}">
      <figcaption>${travail.title}</figcaption>
    `;
    container.appendChild(figure);
  });
}
