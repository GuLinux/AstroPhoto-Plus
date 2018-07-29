import { schema } from 'normalizr'


export const sequenceItemSchema = new schema.Entity('sequenceItems', {}, {
    idAttribute: 'id',
    processStrategy: (v, p) => ({...v, sequence: p.id} ),

});
export const sequenceSchema = new schema.Entity('sequences', {
        sequenceItems: [ sequenceItemSchema ]
    }, {
        idAttribute: 'id',
    }
);
export const sequenceListSchema = [ sequenceSchema ];

export const commandSchema = new schema.Entity('commands');
export const commandsSchema = [ commandSchema ];


