import React from 'react';
import ModalContainer from '../Modals/ModalContainer';
import AddSequenceItemModal from '../SequenceItems/AddSequenceItemModal'
import SequenceItemsContainer from '../SequenceItems/SequenceItemsContainer';
import { Button, Label, Container, Header, Grid, Card, Icon, Menu } from 'semantic-ui-react';
import { canStart } from './model';
import { INDISwitchPropertyContainer } from '../INDI-Server/INDIPropertyContainer';
import INDILight from '../INDI-Server/INDILight';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import PRINTJ from 'printj'
import LastCapturedSequenceImageContainer from './LastCapturedSequenceImageContainer';


// TODO: refactor Gear pages out of this

const DeviceCardHeader = ({device}) => {
    let labelStyle = device.connected ? 'green' : 'orange'
    let icon = device.connected ? 'check' : 'close';
    let connection = device.connected ? 'connected' : 'not connected';
    return (
        <React.Fragment>
            <Icon name={icon} color={labelStyle} circular style={{float: 'right'}} />
            <Card.Header size="medium">{device.name}</Card.Header>
            <Card.Meta color={labelStyle}>{connection}</Card.Meta>
        </React.Fragment>
    )

}



const CameraDetailsPage = ({camera}) => {
    if(!camera)
        return null;
    let exposureAbortPropertyComponent = null;
    if(camera.abortExposureProperty)
        exposureAbortPropertyComponent = <INDISwitchPropertyContainer property={camera.abortExposureProperty} />
    return (
        <Card>
            <Card.Content>
                   <DeviceCardHeader device={camera} />
                    <Card.Description>
                        <Label.Group>
                            { camera.exposureProperty && (
                            <React.Fragment>
                                <Label content='Current exposure: ' basic/>
                                <Label content={PRINTJ.sprintf(camera.exposureProperty.values[0].format, camera.exposureProperty.values[0].value)} />
                                <INDILight state={camera.exposureProperty.state } />
                            </React.Fragment>
                            )}
                        </Label.Group>
                    </Card.Description>
            </Card.Content>
            <Card.Content extra> 
                {exposureAbortPropertyComponent}
            </Card.Content>
        </Card>
    )
}

const FilterWheelDetailsPage = ({filterWheel, filterNumber, filterName}) => {
    if(!filterWheel)
        return null;
    return (
        <Card>
            <Card.Content>
                   <DeviceCardHeader device={filterWheel} />
                    <Card.Description>
                        {filterWheel.connected && (
                            <Label.Group>
                                <Label basic content='Current filter: '/>
                                <Label content={`${filterWheel.currentFilter.name} (${filterWheel.currentFilter.number})`}/>
                            </Label.Group>
                        )}
                    </Card.Description>
            </Card.Content>
        </Card>
    )
}

const AddSequenceItem = withRouter( ({history, onCreateSequenceItem, sequenceId}) => (
    <AddSequenceItemModal onAddSequenceItem={(...args) => {
        onCreateSequenceItem(...args);
        history.push('/sequences/' + sequenceId + '/items/pending')
    }} />
))

class Sequence extends React.Component {

    updateMenu = () => {
        const { startSequence, sequence, canEdit, onMount } = this.props;
        if(sequence === null)
            return;
        onMount(
            <React.Fragment>
                <Menu.Item header content='Sequence Items' />
                <Menu.Item icon='play' onClick={() => startSequence()} disabled={!canStart(sequence)} content='start' />
                <ModalContainer.MenuItem.Open icon='add' modal={AddSequenceItemModal.NAME} disabled={!canEdit} content='new' />
                <Menu.Item icon='arrow left' as={Link} to="/sequences" content='back to sequences' />
            </React.Fragment>
        );
    }

    componentDidMount = () => this.updateMenu();
    componentDidUpdate = () => this.updateMenu();
    componentWillUnmount = () => this.props.onUnmount();


    render = () => {
        const {sequence, onCreateSequenceItem, startSequence, camera, filterWheel, canEdit} = this.props;
        if(sequence === null)
            return null;
        return (
        <Container>
            <Header size="medium">{sequence.name}</Header>
            <AddSequenceItem onCreateSequenceItem={onCreateSequenceItem} sequenceId={sequence.id} />

            <SequenceItemsContainer canEdit={canEdit} sequenceId={sequence.id} />

            <Header size="medium">Devices</Header>
            <Card.Group>
                <CameraDetailsPage camera={camera} />
                <FilterWheelDetailsPage filterWheel={filterWheel} />
            </Card.Group>

            <LastCapturedSequenceImageContainer sequence={sequence.id} />
        </Container>
    )}
}

    

export default Sequence
