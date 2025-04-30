/**
 * Category view module handling category filtering UI.
 * @module views/categoryView
 */

import { getUniqueCategories } from '../models/categoryModel.js';

/**
 * Renders category filter buttons and sets up their event handlers.
 * @async
 * @function renderCategoryButtons
 * @export
 * @param {Array} travaux - Array of work items to filter
 * @param {function} renderGalerie - Callback function to render filtered gallery
 */
export async function renderCategoryButtons(travaux, renderGalerie) {
  const menu = document.querySelector('#menu-categories');
  if (!menu) return;

  const uniqueCategories = getUniqueCategories(travaux);

  menu.innerHTML = '';

  // Create "All" button
  const allBtn = document.createElement('button');
  allBtn.className = 'category-button category-button-active';
  allBtn.textContent = 'Tous';
  allBtn.addEventListener('click', () => {
    renderGalerie(window.travaux);
    setActiveButton(allBtn);
  });
  menu.appendChild(allBtn);

  // Create category-specific buttons
  uniqueCategories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'category-button';
    btn.textContent = cat.name;
    btn.dataset.categoryId = cat.id;

    btn.addEventListener('click', () => {
      const filtered = travaux.filter(t => t.category.id === cat.id);
      renderGalerie(filtered);
      setActiveButton(btn);
    });

    menu.appendChild(btn);
  });
}

/**
 * Sets the active state on the clicked category button.
 * @function setActiveButton
 * @param {HTMLElement} activeBtn - The button to mark as active
 */
function setActiveButton(activeBtn) {
  document.querySelectorAll('.category-button').forEach(btn => {
    btn.classList.remove('category-button-active');
  });
  activeBtn.classList.add('category-button-active');
}