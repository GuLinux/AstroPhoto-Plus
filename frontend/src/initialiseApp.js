import { render } from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

export const initialiseApp = app => {
    render(app, document.getElementById('root'));
//    registerServiceWorker();
}

