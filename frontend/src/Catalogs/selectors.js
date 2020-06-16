import { createSelector } from 'reselect'
import createCachedSelector from 're-reselect';
import { sortBy } from 'lodash';

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

const catalogSearchSection = (state, {sectionKey}) => state.catalogs[sectionKey] || {};

const filterObjectNames = objectNames => {
    const priorityCatalogues = ['NAME', 'M', 'NGC', 'IC', 'C']
    const sortedNames = sortBy(objectNames, ({catalog, name}) => {
        let priority = priorityCatalogues.indexOf(catalog);
        return priority == -1 ? 99 : priority;
    });
    return sortedNames.slice(0,6);
}

export const catalogSearchSelector = createCachedSelector(
    // input
    [
        getCatalogsDropdownSelector,
        catalogSearchSection,
    ],
    // result
    (catalogs, {results, ...search}) => {
        let resultsFiltered;
        if(results) {
            resultsFiltered = results.map(result => ({
                ...result,
                objectNames: result.objectNames && filterObjectNames(result.objectNames),
            }));
        }
        return {
            catalogs,
            search: {
                results: resultsFiltered,
                ...search,
            },
        };
    }
)(getSectionKey);
