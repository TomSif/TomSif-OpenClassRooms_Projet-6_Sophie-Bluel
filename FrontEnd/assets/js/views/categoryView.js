export function renderCategoryButtons(travaux, onFilterCallback) {
    const menu = document.querySelector('#menu-categories');
    if (!menu) return;
  
    const uniqueCategories = Array.from(
      new Map(travaux.map(t => [t.category.id, t.category])).values()
    );
  
    menu.innerHTML = '';
  
    const allBtn = document.createElement('button');
    allBtn.className = 'category-button category-button-active';
    allBtn.textContent = 'Tous';
    allBtn.addEventListener('click', () => {
      onFilterCallback(travaux);
      setActiveButton(allBtn);
    });
    menu.appendChild(allBtn);
  
    uniqueCategories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'category-button';
      btn.textContent = cat.name;
      btn.dataset.categoryId = cat.id;
  
      btn.addEventListener('click', () => {
        const filtered = travaux.filter(t => t.category.id === cat.id);
        onFilterCallback(filtered);
        setActiveButton(btn);
      });
  
      menu.appendChild(btn);
    });
  }
  
  function setActiveButton(activeBtn) {
    document.querySelectorAll('.category-button').forEach(btn => {
      btn.classList.remove('category-button-active');
    });
    activeBtn.classList.add('category-button-active');
  }
  