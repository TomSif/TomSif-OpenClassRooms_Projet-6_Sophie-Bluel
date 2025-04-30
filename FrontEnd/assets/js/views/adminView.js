/**
 * Admin view module handling UI elements and authentication state.
 * @module views/adminView
 */

/**
 * DOM elements used in admin view.
 * @type {Object}
 * @property {HTMLElement} mainModal - Main modal element
 * @property {HTMLElement} secondaryModal - Secondary modal element
 * @property {HTMLElement} openSecondaryBtn - Button to open secondary modal
 * @property {HTMLElement} closeSecondaryBtn - Button to close secondary modal
 * @property {HTMLElement} closeFromSecondary - Button to close main modal from secondary
 * @property {HTMLElement} btnModifier - Edit mode button
 * @property {HTMLElement} banner - Admin banner element
 * @property {HTMLElement} loginButton - Login/logout button
 * @property {HTMLElement} closeBtn - Modal close button
 * @property {HTMLElement} galleryModal - Gallery modal element
 */

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

/**
 * Toggles edit mode UI elements visibility.
 * @function toggleEditMode
 * @export
 * @param {boolean} [activate=true] - Whether to activate or deactivate edit mode
 */

export function toggleEditMode(activate = true) {
    const { btnModifier, banner } = elements;  // Using destructuring to access elements
    
    if (activate) {
        // Activate edit mode
        if (btnModifier) btnModifier.classList.remove('display-none');
        if (banner) banner.classList.remove('display-none');
    } else {
        // Deactivate edit mode
        if (btnModifier) btnModifier.classList.add('display-none');
        if (banner) banner.classList.add('display-none');
    }
}

/**
 * Configures UI based on authentication state.
 * @function setupAuthenticationUI
 * @export
 */

export function setupAuthenticationUI() {
    const isAdmin = !!sessionStorage.getItem('token');
    // Also store this value in localStorage if needed elsewhere
    if (isAdmin) {
        localStorage.setItem('isAdmin', 'true');
    }
    
    if (isAdmin) {
        if (elements.banner) elements.banner.classList.remove('display-none');
        if (elements.btnModifier) elements.btnModifier.classList.remove('display-none');
        
        if (elements.loginButton) {
            elements.loginButton.textContent = 'logout';
            elements.loginButton.href = '#';
            
            // Prevent multiple event listeners
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

/**
 * Handles logout process.
 * @function handleLogout
 * @param {Event} e - Click event
 */

function handleLogout(e) {
    e.preventDefault();
    sessionStorage.removeItem('token'); // Remove from sessionStorage where it's actually stored
    localStorage.removeItem('isAdmin');
    
    if (elements.btnModifier) elements.btnModifier.classList.add('display-none');
    if (elements.banner) elements.banner.classList.add('display-none');
    
    window.location.reload();
}