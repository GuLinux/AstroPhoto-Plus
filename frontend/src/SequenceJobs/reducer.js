
let addSequenceJob = (state, action) => {
    let sequenceJob = action.sequenceJob;
    return {
        ...state,
        [sequenceJob.id]: sequenceJob
    }
}

let sequenceJobRemoved = (state, action) => {
    let sequenceJobID = action.sequenceJob.id;
    let newState = {...state};
    delete newState[sequenceJobID];
    return newState;
}


const sequenceJobs = (state = {}, action) => {
    switch(action.type) {
        case 'NEW_SEQUENCE_JOB':
            return {...state, 'pending': { id: 'pending', type: action.itemType, sequence: action.sequenceID }};
        case 'SEQUENCE_JOB_UPDATED':
            return addSequenceJob(state, action);
        case 'SEQUENCE_JOB_DELETED':
            return sequenceJobRemoved(state, action)
        case 'RECEIVE_SEQUENCES':
            return {...state, ...action.sequenceJobs};
        case 'SEQUENCE_CREATED':
            return {...state, ...action.sequenceJobs};
        case 'SEQUENCE_UPDATED':
            return {...state, ...action.data.entities.sequenceJobs};
        case 'SEQUENCE_JOB_IMAGES_PREVIEW':
            return {...state, imagesPreview: action.imagesPreview};
        default:
            return state;
    }
}

export default sequenceJobs
