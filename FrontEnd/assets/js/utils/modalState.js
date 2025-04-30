/**
 * Modal state management module.
 * @module utils/modalState
 */

/**
 * Initial modal state object.
 * @type {Object}
 * @property {boolean} isOpen - Whether any modal is currently open
 * @property {boolean} isLoaded - Whether modal content is loaded
 * @property {string|null} activeModal - Currently active modal ('main', 'secondary', or null)
 */
let state = {
    isOpen: false,
    isLoaded: false,
    activeModal: null
};

/**
 * Modal state management utility.
 * @namespace modalStateManager
 * @property {function} updateState - Updates modal state
 * @property {function} getState - Retrieves current state
 * @property {function} resetGalerie - Resets gallery state
 */
export const modalStateManager = {
    /**
     * Updates modal state with new values.
     * @function updateState
     * @memberof modalStateManager
     * @param {Object} newState - Partial state object with new values
     * @returns {Object} The updated complete state object
     */
    updateState: (newState) => {
        state = { ...state, ...newState };
        return state;
    },

    /**
     * Retrieves current modal state.
     * @function getState
     * @memberof modalStateManager
     * @returns {Object} Current state object
     */
    getState: () => state,

    /**
     * Resets gallery state and clears gallery content.
     * @function resetGalerie
     * @memberof modalStateManager
     */
    resetGalerie: () => {
        const modalgalery = document.getElementById("galery-modal");
        if (modalgalery) modalgalery.innerHTML = '';
        state.isLoaded = false;
    }
};