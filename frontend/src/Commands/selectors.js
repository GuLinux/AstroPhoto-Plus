import { createSelector } from 'reselect';


export const commandsSelector = createSelector([
    state => state.commands.fetching,
    state => state.commands.ids,
    state => state.commands.commands,
], (fetching, commandIds, commandEntities) => {
    const commands = commandIds.map(id => commandEntities[id]);
    if(!commands || commands.length === 0) {
        return { fetching };
    }
    
    const categories = commands.reduce( (acc, cur) => {
        let category = cur.category in acc ? acc[cur.category] : { commands: [] };
        category.commands.push(cur);
        return {...acc, [cur.category]: category};
    }, {});
    
    return {
        categories,
        fetching,
    };
});
    

