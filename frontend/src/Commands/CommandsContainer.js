import { Commands } from './Commands';
import { connect } from 'react-redux';
import Actions from '../actions';
import { commandsSelector } from './selectors';

const addErrorNotification = (title, message) => Actions.Notifications.add(title, message, 'error');

const mapDispatchToProps = {
    onError: addErrorNotification,
    refresh: Actions.Commands.get,
};

export const CommandsContainer = connect(commandsSelector, mapDispatchToProps)(Commands);
