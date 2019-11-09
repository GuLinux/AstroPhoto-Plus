//import { createSelector } from 'reselect';


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
    [getPHD2Profiles, getPHD2State],
    (profiles, phd2State) => ({
        profiles: profiles && profiles.map(({id, name}) => ({ key: id, text: name, value: id })),
        selectedProfile: profiles && profiles.find(p => p.selected).id,
        phd2State,
    })
);

const buildGuideStep= ({dx, dy, Timestamp: timestamp}, {Timestamp: lastTimestamp}) => {
    const dt = parseFloat(timestamp - lastTimestamp);
    return {
        dx,
        dy,
        timestamp,
        dt,
    };
}

export const phd2GraphSelector = createSelector(
    [state => state.phd2.guideSteps],
    (guideSteps) => {
        if(guideSteps.length === 0) {
            return { guideSteps: [] };
        }
        const lastGuideStep = guideSteps.slice(-1)[0];
        const allDeltas = guideSteps.map(g => g.dx).concat(guideSteps.map(g => g.dy));
        const maxDelta = Math.max(...allDeltas.map(Math.abs));
        const domainRadius = Math.ceil(Math.max(0.5, maxDelta * 1.5) * 10) / 10;
        const data = guideSteps.map(g => buildGuideStep(g, lastGuideStep));
        const xDomain = [Math.floor(data[0].dt), 0];
        const timeTicks = [];
        for(let i=xDomain[0]; i<=xDomain[1]; i++) {
            timeTicks.push(i);
        }
        return {
            guideSteps: data,
            domain: [-domainRadius, domainRadius],
            xDomain,
            timeTicks,
        } 
    }
);
