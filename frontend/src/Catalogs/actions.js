import { fetchAvailableCatalogsAPI, fetchCatalogsAPI, importCatalogAPI, catalogLookupAPI } from '../middleware/api'
import { addNotification } from '../Notifications/actions.js';

export const getAvailableCatalogs = () => dispatch => {
    dispatch({ type: 'CATALOG_FETCHING_AVAILABLE' });
    fetchAvailableCatalogsAPI(dispatch,
        catalogs => dispatch({ type: 'CATALOG_AVAILABLE_RETRIEVED', catalogs }),
        (response, isJSON) => {
            if(!isJSON) {
                return false;
            }
            response.json().then(j => dispatch(addNotification(`${j.error} retrieving catalogs`, `Error retrieving available catalogs: ${j.error_message}`, 'warning')));
            return true;
        }
    );
};

export const getCatalogs = () => dispatch => {
    dispatch({ type: 'CATALOG_FETCHING' });
    fetchCatalogsAPI(dispatch,
        catalogs => dispatch({ type: 'CATALOG_RETRIEVED', catalogs }),
        (response, isJSON) => {
            if(!isJSON) {
                return false;
            }
            response.json().then(j => dispatch(addNotification(`${j.error} retrieving catalogs`, `Error retrieving catalogs: ${j.error_message}`, 'warning')));
            return true;
        }
    );
};


export const importCatalog = (name, displayName) => dispatch => {
    dispatch({ type: 'CATALOG_IMPORT_FETCH' });
    importCatalogAPI(name, dispatch,
        catalogs => {
            dispatch({ type: 'CATALOG_IMPORTED' });
            dispatch(getCatalogs());
            dispatch(addNotification(`Catalog imported`, `${name} catalog successfully imported`, 'success'));
        },
        (response, isJSON) => {
            if(!isJSON) {
                return false;
            }
            response.json().then(j => dispatch(addNotification(`${j.error} importing catalog`, `Error importing ${displayName} catalog: ${j.error_message}`, 'error')));
            return true;
        }
    );
};


export const lookupCatalogObject = (catalog, object, sectionKey ) => dispatch => {
    dispatch({ type: 'CATALOG_LOOKUP_FETCH', sectionKey });
    const onSuccess = results => dispatch({ type: 'CATALOG_LOOKUP_SUCCESS', sectionKey, results});
    const onError = (response, isJSON) => {
        if(isJSON) {
            response.json().then(error => dispatch({type: 'CATALOG_LOOKUP_FAILED', error, sectionKey }));
            return true;
        }
        return false;
    }
    catalogLookupAPI(catalog, object, dispatch, onSuccess, onError);
}

export const clearCatalogResults = sectionKey => ({ type: 'CATALOG_CLEAR_RESULTS', sectionKey });
