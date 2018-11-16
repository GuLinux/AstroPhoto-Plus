import React from 'react';
import { NotFoundPage } from '../components/NotFoundPage';
import { Form, Container, Header, Button} from 'semantic-ui-react';

export const PlateSolvingSectionMenu = ({astrometryDrivers}) => astrometryDrivers.length > 0 && (
    <Form size='tiny'>
    </Form>
);

export const PlateSolvingPage = ({astrometryDrivers, telescopes, cameras}) => {
    if(astrometryDrivers.all.length === 0)
        return <NotFoundPage
            backToUrl='/indi/server'
            title='No Astrometry driver found'
            message='Astrometry drivers not found. Please double check that your INDI server is connected, with at least one connected astrometry device.'
            backButtonText='INDI server page'
        />;
    if(telescopes.all.length === 0)
        return <NotFoundPage
            backToUrl='/indi/server'
            title='No telescopes found'
            message={
                <React.Fragment>
                    <p>
                        You need to connect at least a telescope to use this functionality. 
                    </p>
                    <p>
                        Please double check that your INDI server is connected, with at least a connected telescope device.
                    </p>
                    <p>
                        {'If you don\'t have one, or you have a manual mount, you can use the "Telescope Simulator" driver.'}
                    </p>
                </React.Fragment>
            }
            backButtonText='INDI server page'
        />;

    return (
       <Container>
           <Form>
               <Form.Field>
                    <Header content='Astrometry driver'/>
                        { astrometryDrivers.all.map(d => <Button content={d.name} />)}

                </Form.Field>
               <Form.Field>
                    <Header content='Telescope'/>
                        { telescopes.all.map(d => <Button content={d.name} />)}
                </Form.Field>

           </Form>
           
           <p>Placeholder. Select astrometry driver here</p>
            <p>Placeholder. Select telescope focal length, multiplier, enter manual focal length</p>
            <p>Also select action after plate solving (ignore, sync telescope)</p>
            <Header content='options' />
            <Header content='enable/disable' />
            <p>Enable on next shot (camera module) or by manually uploading a file</p>
            <Header content='results' />
       </Container> 
    );
}