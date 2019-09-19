const defaultState = {
    availableCatalogs: {},
    catalogs: {}
};

export const catalogs = (state = defaultState, action) => {
    switch(action.type) {
        case 'CATALOG_AVAILABLE_RETRIEVED':
            return {...state, availableCatalogs: action.catalogs };
        case 'CATALOG_RETRIEVED':
            return {...state, catalogs: action.catalogs };
        default:
            return state;
    }
}
