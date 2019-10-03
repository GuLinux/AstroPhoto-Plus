import { createSelector } from 'reselect';


export const getPHD2Connected = state => state.phd2.connected;
export const getPHD2StarLost = state => state.phd2.starLost;

const phd2ProcessRunning = state => state.phd2.process;
const getPHD2ConnectionError = state => state.phd2.connection_error;
const getPHD2Version = state => state.phd2.version;
const getPHD2State= state => state.phd2.phd2_state;
const getPHD2Profiles = state => state.phd2.profiles;
const getPHD2EquipmentConnected = state => state.phd2.equipment_connected;


export const phd2ProcessSelector = createSelector([phd2ProcessRunning, getPHD2Connected], (processRunning, connected) => ({
    processRunning,
    connected,
}));

export const phd2PageSelector = createSelector(
    [phd2ProcessRunning, getPHD2Connected, getPHD2ConnectionError, getPHD2Version, getPHD2State],
    (processRunning, connected, connectionError, version, phd2State) => ({
        connected,
        connectionError,
        showProcessRow: ! (connected && !processRunning),
        version,
        phd2State,
    })
);

export const phd2ProfilesSelector = createSelector(
    [getPHD2Profiles, getPHD2EquipmentConnected],
    (profiles, equipmentConnected) => ({
        profiles: profiles && profiles.map(({id, name}) => ({ key: id, text: name, value: id })),
        selectedProfile: profiles && profiles.find(p => p.selected).id,
        equipmentConnected,
    })
);
