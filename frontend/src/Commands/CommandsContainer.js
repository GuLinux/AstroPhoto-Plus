import { Commands } from './Commands';
import { connect } from 'react-redux';
import Actions from '../actions';

const mapStateToProps = (state, ownProps) => ({
    commands: state.commands.ids.map(id => state.commands.commands[id]),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onError: (title, message) => dispatch(Actions.Notifications.add(title, message, 'error')),
});

export const CommandsContainer = connect(mapStateToProps, mapDispatchToProps)(Commands);
