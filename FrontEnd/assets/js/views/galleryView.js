export function renderGalerie(travaux) {
    const container = document.querySelector('.gallery');
    container.innerHTML = '';
    travaux.forEach(travail => {
      const figure = document.createElement('figure');
      figure.innerHTML = `
        <img src="${travail.imageUrl}" alt="${travail.title}">
        <figcaption>${travail.title}</figcaption>
      `;
      container.appendChild(figure);
    });
  }
  