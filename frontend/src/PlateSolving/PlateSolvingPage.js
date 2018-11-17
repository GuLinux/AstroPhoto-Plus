import React from 'react';
import { NotFoundPage } from '../components/NotFoundPage';
import { Form, Container, Header} from 'semantic-ui-react';
import { CheckButton } from '../components/CheckButton';
import { PlateSolving as PlateSolvingActions } from './actions';

const { Options } = PlateSolvingActions;

export const PlateSolvingSectionMenu = ({astrometryDrivers}) => astrometryDrivers.length > 0 && (
    <Form size='tiny'>
    </Form>
);

class PlateSolving extends React.Component {

    componentDidMount = () => {
        this.setDefaultDevice(Options.telescope, this.props.telescopes);
        this.setDefaultDevice(Options.astrometryDriver, this.props.astrometryDrivers);
    }

    setDefaultDevice = (option, devices) => {
        if(!this.props.options[option] && devices.length === 1) {
            this.props.setOption(option, devices.all[0].id);
        }
    }

    optionButton = (option, value, props={}) => 
        <CheckButton active={this.props.options[option] === value} onClick={() => this.props.setOption(option, value)} {...props} />

    render = () => {
        const { astrometryDrivers, telescopes, cameras } = this.props;
        return (
        <Container>
            <Form>
                <Form.Field>
                        <Header content='Astrometry driver'/>
                            { astrometryDrivers.all.map(d => this.optionButton(Options.astrometryDriver, d.id, { content: d.name, key: d.id})) }
                    </Form.Field>
                <Form.Field>
                        <Header content='Telescope'/>
                            { telescopes.all.map(d => this.optionButton(Options.telescope, d.id, { content: d.name, key: d.id })) }
                    </Form.Field>
                    <Form.Field>
                        <Header content='Listen on camera'/>
                            {this.optionButton(Options.camera, 'off', {content: 'Off'})}
                            { cameras.all.map(d => this.optionButton(Options.camera, d.id, { content: d.name, key: d.id })) }
                    </Form.Field>
                    
            </Form>
            </Container> 
        );
        // TODO: manual upload
    }
}

export const PlateSolvingPage = ({astrometryDrivers, telescopes, ...props}) => {
    if(astrometryDrivers.all.length === 0)
        return <NotFoundPage
            backToUrl='/indi/server'
            title='No Astrometry driver found'
            message='Astrometry drivers not found. Please double check that your INDI server is connected, with at least one connected astrometry device.'
            backButtonText='INDI server page'
        />;
    if(telescopes.all.length === 0)
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
        return <PlateSolving {...{astrometryDrivers, telescopes, ...props}} />
}