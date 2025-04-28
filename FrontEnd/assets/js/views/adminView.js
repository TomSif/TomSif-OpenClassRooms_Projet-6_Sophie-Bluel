const elements = {
    mainModal: document.getElementById('modal'),
    secondaryModal: document.getElementById('secondary-modal'),
    openSecondaryBtn: document.getElementById('open-secondary'),
    closeSecondaryBtn: document.getElementById('close-secondary-modal'),
    closeFromSecondary: document.getElementById('close-main-modal-from-secondary'),
    btnModifier: document.getElementById('btnModifier'),
    banner: document.getElementById('banner'),
    loginButton: document.getElementById('login'),
    closeBtn: document.getElementById('close-modal'),
    galleryModal: document.getElementById('galery-modal')
};

// Fonction pour activer/désactiver le mode édition
export function toggleEditMode(activate = true) {
    const { btnModifier, banner } = elements;  // Utilisation de la destructuration pour accéder aux éléments
    
    if (activate) {
        // Activer le mode édition
        if (btnModifier) btnModifier.classList.remove('display-none');
        if (banner) banner.classList.remove('display-none');
    } else {
        // Désactiver le mode édition
        if (btnModifier) btnModifier.classList.add('display-none');
        if (banner) banner.classList.add('display-none');
    }
}

// Configuration de l'interface utilisateur en fonction de l'authentification
export function setupAuthenticationUI() {
    const isAdmin = !!sessionStorage.getItem('token');
    // Stocker également cette valeur dans localStorage si vous en avez besoin ailleurs
    if (isAdmin) {
        localStorage.setItem('isAdmin', 'true');
    }
    
    if (isAdmin) {
        if (elements.banner) elements.banner.classList.remove('display-none');
        if (elements.btnModifier) elements.btnModifier.classList.remove('display-none');
        
        if (elements.loginButton) {
            elements.loginButton.textContent = 'Logout';
            elements.loginButton.href = '#';
            
            // Éviter les écouteurs multiples
            const newLoginButton = elements.loginButton.cloneNode(true);
            if (elements.loginButton.parentNode) {
                elements.loginButton.parentNode.replaceChild(newLoginButton, elements.loginButton);
            }
            elements.loginButton = newLoginButton;
            elements.loginButton.addEventListener('click', handleLogout);
        }
    } else {
        if (elements.btnModifier) elements.btnModifier.classList.add('display-none');
        if (elements.banner) elements.banner.classList.add('display-none');
    }
}

function handleLogout(e) {
    e.preventDefault();
    sessionStorage.removeItem('token'); // Supprimer du sessionStorage où il est réellement stocké
    localStorage.removeItem('isAdmin');
    
    if (elements.btnModifier) elements.btnModifier.classList.add('display-none');
    if (elements.banner) elements.banner.classList.add('display-none');
    
    window.location.reload();
}