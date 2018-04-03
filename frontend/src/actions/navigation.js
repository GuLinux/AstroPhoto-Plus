export const Navigation = {

    toSection: section => ({ type: 'NAVIGATE_TO_SECTION', section }),
    toSequence: (page, sequence) => ({ type: 'NAVIGATE_TO_SEQUENCE', sequencePage: page, sequenceId: sequence }),
    toINDIDevice: device => ({ type: 'NAVIGATE_TO_INDI_DEVICE', device }),
    toINDIGroup: (device, group) => ({ type: 'NAVIGATE_TO_INDI_GROUP', device, group })
}

export default Navigation

