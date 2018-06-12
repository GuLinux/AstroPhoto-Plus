import React from 'react';
import { Accordion, Checkbox, Container, Label, Icon, Grid} from 'semantic-ui-react'

const INDIDriver = ({driver, toggleDriverSelection, serverRunning }) => (
    <Checkbox
        label={driver.name}
        onChange={(undefined, data) => toggleDriverSelection(driver.name, data.checked)}
        checked={driver.selected}
        disabled={serverRunning}
        //toggle
    />
)

class INDIDriversGroup extends React.Component {
    constructor(props) {
        super(props)
        this.state = { expanded: this.hasSelectedDrivers() }
    }

    toggle = () => this.setState({...this.state, expanded: ! this.state.expanded })

    hasSelectedDrivers = () => this.props.group.selectedDrivers.length > 0;

    titleIcon = () => this.hasSelectedDrivers() ? <Icon name='check'/> : null;

    render = () => (
        <Container>
            <Accordion.Title
                active={this.state.expanded}
                onClick={ () => this.toggle()}
            >
                <Grid columns={12}>
                    <Grid.Column width={11}>
                        {this.props.group.name}
                    </Grid.Column>
                    <Grid.Column textAlign='right' floated='right'>
                        {this.titleIcon()}
                    </Grid.Column>
                </Grid>
            </Accordion.Title>
            <Accordion.Content active={this.state.expanded}>
                <Grid columns={3} stackable>
                    {
                        this.props.group.drivers.map((d, index) => (
                            <Grid.Column key={index}>
                                <INDIDriver
                                    driver={this.props.drivers[d]}
                                    toggleDriverSelection={this.props.toggleDriverSelection}
                                    serverRunning={this.props.serverRunning}
                                />
                            </Grid.Column>
                        ))
                    }
                </Grid>
            </Accordion.Content>
        </Container>
    );
}


const INDIServiceDevicesPage = ({groups, drivers, serverFound, serverRunning, toggleDriverSelection}) => {
    if(! serverFound)
        return null;
    return (
        <Container>
            <Accordion exclusive={false} fluid styled>
                { Object.keys(groups).map( group =>
                    <INDIDriversGroup key={group} group={groups[group]} drivers={drivers} toggleDriverSelection={toggleDriverSelection} serverRunning={serverRunning} />
                )}
            </Accordion>
        </Container>
    )
}

export default INDIServiceDevicesPage
