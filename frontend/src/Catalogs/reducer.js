const defaultState = {
    availableCatalogs: {},
    catalogs: {}
};


const catalogFetch = (state, {sectionKey}) => ({...state, [sectionKey]: { fetching: true }});
const catalogFetchSuccess = (state, {sectionKey, object: lookupObject }) => ({...state, [sectionKey]: { lookupObject }});
const catalogLookupFailed = (state, {sectionKey, error}) => ({...state, [sectionKey]: { fetching: false, error }}); 

export const catalogs = (state = defaultState, action) => {
    switch(action.type) {
        case 'CATALOG_AVAILABLE_RETRIEVED':
            return {...state, availableCatalogs: action.catalogs };
        case 'CATALOG_RETRIEVED':
            return {...state, catalogs: action.catalogs };
        case 'CATALOG_LOOKUP_FETCH':
            return catalogFetch(state, action);
        case 'CATALOG_LOOKUP_SUCCESS':
            return catalogFetchSuccess(state, action);
        case 'CATALOG_LOOKUP_FAILED':
            return catalogLookupFailed(state, action);
        case 'CATALOG_IMPORT_FETCH':
            return {...state, importing: true };
        case 'CATALOG_IMPORTED':
            return {...state, importing: false };
        case 'CATALOG_CLEAR_RESULTS':
            return {...state, [action.sectionKey]: {}};
        default:
            return state;
    }
}
