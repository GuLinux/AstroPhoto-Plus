import { createSelector } from 'reselect';
import { get } from 'lodash';

const getSettings = state => state.settings;
const getVersion = state => get(state, 'version.version');
const getCommands = state => state.commands;

export const settingsSelector = createSelector([
    getSettings,
    getVersion,
    getCommands,
], (settings, version, commands) => ({
    settings,
    version,
    showCommands: commands.ids.length > 0 || commands.fetching,
}));
