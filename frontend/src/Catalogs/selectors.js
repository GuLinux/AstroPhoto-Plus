import { createSelector } from 'reselect'
import createCachedSelector from 're-reselect';

export const getAvailableCatalogs = state => state.catalogs.availableCatalogs;
export const getCatalogs = state => state.catalogs.catalogs;

export const getCatalogImportingStatus = state => state.catalogs.importing;

export const getCurrentCatalogs = createSelector([getCatalogs], catalogs => Object.keys(catalogs).map(catalogName => ({ catalogName, ...catalogs[catalogName] })));

export const getDownloadableCatalogs = createSelector([getCatalogs, getAvailableCatalogs], (catalogs, availableCatalogs) => {
    return Object.keys(availableCatalogs)
        .map(catalogDownloadName => ({ catalogDownloadName, ...availableCatalogs[catalogDownloadName] }) )
        .filter(downloadableCatalog => ! downloadableCatalog.provides.every(catalogName => Object.keys(catalogs).includes(catalogName) ))
    ;
});

export const getCatalogsDropdownSelector = createSelector([getCurrentCatalogs], catalogs => catalogs.map(c => ({
    key: c.catalogName,
    text: c.display_name,
    value: c.catalogName,
}) ));

const getSectionKey = (state, {sectionKey}) => sectionKey;

const catalogSearchSection = (state, {sectionKey}) => state.catalogs[sectionKey];

export const catalogSearchSelector = createCachedSelector(
    // input
    [
        getCatalogsDropdownSelector,
        catalogSearchSection,
    ],
    // result
    (catalogs, section) => ({ catalogs, search: section })
)(getSectionKey);
