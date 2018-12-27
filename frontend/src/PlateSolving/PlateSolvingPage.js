import React from 'react';
import { NotFoundPage } from '../components/NotFoundPage';
import { Form } from 'semantic-ui-react';
import { CameraShootingSectionMenuEntriesContaner } from '../Camera/CameraSectionMenuEntriesContainer';


import { PlateSolvingContainer } from './PlateSolvingContainer';


// TODO: possibly move some driver selection in the menu
export const PlateSolvingSectionMenu = ({listenToCamera}) => listenToCamera && (
    <Form size='tiny'>
        <CameraShootingSectionMenuEntriesContaner />
    </Form>
);


export const PlateSolvingPage = ({hasAstrometry, hasTelescopes}) => {
    if(!hasAstrometry)
        return <NotFoundPage
            backToUrl='/indi/server'
            title='No Astrometry driver found'
            message='Astrometry drivers not found. Please double check that your INDI server is connected, with at least one connected astrometry device.'
            backButtonText='INDI server page'
        />;
    if(!hasTelescopes)
        return (<NotFoundPage
            backToUrl='/indi/server'
            title='No telescopes found'
            message={null}
            backButtonText='INDI server page'
            >
                <div>
                    <p>
                        You need to connect at least a telescope to use this functionality. 
                    </p>
                    <p>
                        Please double check that your INDI server is connected, with at least a connected telescope device.
                    </p>
                    <p>
                        {'If you don\'t have one, or you have a manual mount, you can use the "Telescope Simulator" driver.'}
                    </p>
                </div>
        </NotFoundPage>)
        return <PlateSolvingContainer />
}
