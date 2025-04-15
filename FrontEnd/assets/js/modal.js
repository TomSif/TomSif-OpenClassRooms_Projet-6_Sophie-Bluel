document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("modal");
    const openBtn = document.getElementById('btnModifier');
    const closeBtn = document.getElementById('close-modal');

    openBtn.addEventListener('click', () => {
        modal.showModal(); 
        modal.classList.toggle('hidden');
      });
  
    closeBtn.addEventListener('click', () => {
      modal.close();
      modal.classList.toggle('hidden');

    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.close();
        modal.classList.toggle('hidden');
      }});

      // fonction pour afficher les photos dans la modale


})