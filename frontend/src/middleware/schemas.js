import { schema } from 'normalizr'


export const sequenceJobSchema = new schema.Entity('sequenceJobs', {}, {
    idAttribute: 'id',
    processStrategy: (v, p) => ({...v, sequence: p.id} ),

});
export const sequenceSchema = new schema.Entity('sequences', {
        sequenceJobs: [ sequenceJobSchema ]
    }, {
        idAttribute: 'id',
    }
);
export const sequenceListSchema = [ sequenceSchema ];

export const commandSchema = new schema.Entity('commands');
export const commandsSchema = [ commandSchema ];


