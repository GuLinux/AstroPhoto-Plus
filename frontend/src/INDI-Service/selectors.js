import { createSelector } from 'reselect'
import { getServerState, getINDIServerBusySelector } from '../INDI-Server/selectors';

export const getINDIServiceDriversInputSelector = state => state.indiservice.drivers;
export const getINDIServiceGroupsInputSelector = state => state.indiservice.groups;
export const getINDIServiceSelectedDriversInputSelector = state => state.indiservice.selectedDrivers;

export const getINDIServiceDrivers = createSelector([getINDIServiceDriversInputSelector, getINDIServiceSelectedDriversInputSelector], (drivers, selectedDrivers) => {
    return Object.keys(drivers).reduce( (acc, driverName) => {
        return {...acc, [driverName]: {...drivers[driverName], selected: selectedDrivers.includes(driverName) } }
    }, {});
});

export const getINDIServiceGroups = createSelector([getINDIServiceGroupsInputSelector, getINDIServiceSelectedDriversInputSelector], (groups, selectedDrivers) => {
    return Object.keys(groups).reduce( (acc, groupName) => {
        return {...acc, [groupName]: {...groups[groupName], selectedDrivers: groups[groupName].drivers.filter(d => selectedDrivers.includes(d)) } }
    }, {});
}); 

export const getINDIEnabledDrivers = createSelector([getINDIServiceDrivers], (drivers) => Object.keys(drivers).filter(d => drivers[d].selected))

export const indiServicePageSelector = createSelector([
    state => state.indiservice,
    getServerState,
    getINDIEnabledDrivers,
    getINDIServerBusySelector,
], (indiservice, indiServerState, drivers, isBusy) => ({
    serverFound: indiservice.server_found,
    serverConnected: indiServerState.connected,
    serverRunning: indiservice.server_running,
    startStopPending: indiservice.startStopPending,
    lastError: indiservice.lastError,
    drivers,
    isBusy,
}));