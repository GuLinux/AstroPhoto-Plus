import { createSelector } from 'reselect'

export const getAvailableCatalogs = state => state.catalogs.availableCatalogs;
export const getCatalogs = state => state.catalogs.catalogs;

export const getCurrentCatalogs = createSelector([getCatalogs], catalogs => Object.keys(catalogs).map(catalogName => ({ catalogName, ...catalogs[catalogName] })));

export const getDownloadableCatalogs = createSelector([getCatalogs, getAvailableCatalogs], (catalogs, availableCatalogs) => {
    return Object.keys(availableCatalogs)
        .map(catalogDownloadName => ({ catalogDownloadName, ...availableCatalogs[catalogDownloadName] }) )
        .filter(downloadableCatalog => ! downloadableCatalog.provides.every(catalogName => Object.keys(catalogs).includes(catalogName) ))
    ;
});
