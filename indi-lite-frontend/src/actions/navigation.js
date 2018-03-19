export const Navigation = {

    toSection: section => ({ type: 'NAVIGATE_TO_SECTION', section }),
    toSession: (page, session) => ({ type: 'NAVIGATE_TO_SESSION', sessionPage: page, sessionId: session }),
    toINDIDevice: device => ({ type: 'NAVIGATE_TO_INDI_DEVICE', device }),
    toINDIGroup: (device, group) => ({ type: 'NAVIGATE_TO_INDI_GROUP', device, group })
}

export default Navigation

