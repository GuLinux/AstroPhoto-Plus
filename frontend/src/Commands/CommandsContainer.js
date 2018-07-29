import { Commands } from './Commands';
import { connect } from 'react-redux';
import Actions from '../actions';

const mapStateToProps = (state, ownProps) => {
    const commands = state.commands.ids.map(id => state.commands.commands[id]);
    if(!commands || commands.length === 0) {
        return {};
    }
    const categories = commands.reduce( (acc, cur) => {
        let category = cur.category in acc ? acc[cur.category] : { commands: [] };
        category.commands.push(cur);
        return {...acc, [cur.category]: category};
    }, {});

    return {
        categories,
    };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    onError: (title, message) => dispatch(Actions.Notifications.add(title, message, 'error')),
    refresh: () => dispatch(Actions.Commands.get()),
});

export const CommandsContainer = connect(mapStateToProps, mapDispatchToProps)(Commands);
