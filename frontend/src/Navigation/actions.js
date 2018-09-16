export default {
    setRightMenu: (data) => ({ type: 'NAVBAR_RIGHT_MENU', data }),
    resetRightMenu: () => ({ type: 'NAVBAR_RIGHT_MENU' }),
    setLandingPath: (route, path) => ({ type: 'SET_LANDING_PATH', route, path}),
};
