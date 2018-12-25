import React from 'react';
import { Menu, Divider, Container, Grid, Form } from 'semantic-ui-react';
import { SequenceJobButtonsContainer } from '../SequenceJobButtonsContainer';
import { INDIPropertySequenceJobDeviceMenuContainer, INDIPropertySequenceJobGroupMenuContainer, INDIPropertySequenceJobValuesMenuContainer } from './INDIPropertySequenceJobMenuContainer';
import { getPropertyName, getPropertyId } from '../../INDI-Server/utils';
import { get } from 'lodash';

export class INDIPropertySequenceJob extends React.Component {
    constructor(props) {
        super(props)
        this.state = { group: '', sequenceJob: {device: '', property: '', wait: -1, ...props.sequenceJob }}

        if(props.sequenceJob.device && props.sequenceJob.property) {
            this.state.group = this.getProperties()[props.sequenceJob.property].group
        }
    }

    isValid() {
        return this.state.sequenceJob.device !== '' && this.state.sequenceJob.property !== '' && Object.keys(this.state.sequenceJob.values).length !== 0;
    }

    isChanged() {
        return true;
    }

    onDeviceChanged = device => this.setState({...this.state, group: '', sequenceJob: {...this.state.sequenceJob, device, property: ''} });

    onGroupChanged = group => this.setState({...this.state, group, sequenceJob: {...this.state.sequenceJob, property: ''} });

    onPropertyChanged = property => this.setState({...this.state, sequenceJob: {...this.state.sequenceJob, property: getPropertyName(property), values:{} } });

    onValueChanged = (values) => this.setState( prevState => ({
        ...prevState,
        sequenceJob: {
            ...prevState.sequenceJob,
            values: {
                ...prevState.sequenceJob.values,
                ...values,
            }
        }
    }));

    onWaitChanged = (checked) => this.setState({...this.state, sequenceJob: {...this.state.sequenceJob, wait: checked ? -1 : 0} });

    renderDevice = d => <Menu.Item
                            active={this.state.sequenceJob.device === d.name}
                            key={d.id}
                            onClick={() => this.onDeviceChanged(d.name)}
                        >
                            {d.name}
                        </Menu.Item>

    render() {
        return (
            <Container>
                <Menu stackable pointing>
                    <Menu.Item header>Device</Menu.Item>
                    { this.props.devices.map(this.renderDevice)}
                </Menu>
                <Grid stackable>
                    <Grid.Column width={2}>
                        <INDIPropertySequenceJobDeviceMenuContainer
                            deviceId={this.state.sequenceJob.device}
                            onGroupSelected={this.onGroupChanged}
                            groupId={this.state.group}
                        />
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <INDIPropertySequenceJobGroupMenuContainer
                            groupId={this.state.group}
                            onPropertySelected={this.onPropertyChanged}
                            propertyId={getPropertyId(this.state.sequenceJob.device, this.state.sequenceJob.property)}
                        />
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <INDIPropertySequenceJobValuesMenuContainer
                            propertyId={getPropertyId(this.state.sequenceJob.device, this.state.sequenceJob.property)}
                            onValueChanged={this.onValueChanged}
                            values={get(this.state, 'sequenceJob.values')}
                        />
                    </Grid.Column>
                </Grid>


                <Divider section />
                <Form>
                    <Form.Checkbox label='Wait until value is set' checked={this.state.sequenceJob.wait !== 0} onChange={(e, data) => this.onWaitChanged(data.checked)}/>
                </Form>
                <Divider section />
                <SequenceJobButtonsContainer isValid={this.isValid()} isChanged={this.isChanged()} sequenceJob={this.state.sequenceJob} />
            </Container>
        )
    }
}

