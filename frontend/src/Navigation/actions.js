
const navigate = (navigationKey, object) => ({ type: 'NAVIGATE_TO', navigationKey, navigation: object });

export const Navigation = {
    toINDIDevice: device => navigate('indi', { device, group: null }),
    toINDIGroup: (device, group) => navigate('indi', { device, group} ),
}

export default Navigation
