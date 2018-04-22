
const navigate = (navigationKey, object) => ({ type: 'NAVIGATE_TO', navigationKey, navigation: object });

export const Navigation = {
    toSection: section => navigate('section', {key: section}),
    toSequence: (page, sequence) => navigate('sequencesPage', {key: page, sequenceID: sequence }),
    toSequenceItem: (page, sequenceItem) => navigate('sequencesPage', {key: page, sequenceItemID: sequenceItem }),
    toINDIDevice: device => navigate('indi', { device, group: null }),
    toINDIGroup: (device, group) => navigate('indi', { device, group} ),
    toggleModal: (name, visible) => ({ type: 'TOGGLE_MODAL', name, visible})
}

export default Navigation

