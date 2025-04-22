let state = {
    isOpen: false,
    isLoaded: false,
    activeModal: null
};

export const modalStateManager = {
    updateState: (newState) => {
        state = { ...state, ...newState };
        return state;
    },
    getState: () => state,
    resetGalerie: () => {
        const modalgalery = document.getElementById("galery-modal");
        if (modalgalery) modalgalery.innerHTML = '';
        state.isLoaded = false;
    }
};