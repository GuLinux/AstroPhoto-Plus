import PackageInfo from '../../package.json';
 
const defaultState = {
    frontend: { version: PackageInfo.version },
    backend: {},
};

export const app = (state = defaultState, action) => {
    switch (action.type) {
        case 'BACKEND_VERSION_FETCHED':
            return { ...state, backend: action.version };
        default:
            return state;
    }
}


