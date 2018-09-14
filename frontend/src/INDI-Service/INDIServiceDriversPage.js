import React from 'react';
import { Accordion, Checkbox, Container, Icon, Grid, Menu, Input} from 'semantic-ui-react'

const INDIDriver = ({driver, toggleDriverSelection, serverRunning }) => (
    <Checkbox
        label={driver.name}
        onChange={(e, data) => toggleDriverSelection(driver.name, data.checked)}
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

const FullDriversList = ({groups, drivers, toggleDriverSelection, serverRunning}) => (
    <Accordion exclusive={false} fluid styled>
        { Object.keys(groups).map( group =>
            <INDIDriversGroup key={group} group={groups[group]} drivers={drivers} toggleDriverSelection={toggleDriverSelection} serverRunning={serverRunning} />
        )}
    </Accordion>
)

const SearchDriversList = ({drivers, toggleDriverSelection, serverRunning, searchString}) => {
    const matchesNoCase = (searchIn, searchString) => searchIn.toLowerCase().includes(searchString.toLowerCase());
    const matches = ({label, name}, searchString) => matchesNoCase(label, searchString) || matchesNoCase(name, searchString);
    return (
        <Grid columns={3} stackable>
            { Object.keys(drivers).filter(driver => matches(drivers[driver], searchString))
                .map( driver =>
                    <Grid.Column key={driver}>
                    <INDIDriver
                        driver={drivers[driver]}
                        toggleDriverSelection={toggleDriverSelection}
                        serverRunning={serverRunning}
                        />
                    </Grid.Column >
                )}
            </Grid>
        )
    }


class INDIServiceDriversPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { searchString: '', };
    }

    onSearch = (searchString) => this.setState({...this.state, searchString})

    render = () => {
        const {groups, drivers, serverFound, serverRunning, toggleDriverSelection} = this.props;
        if(! serverFound)
            return null;
        return (
            <Container>
                <Menu secondary fluid size='small' borderless>
                    <Menu.Item fitted header content='Available drivers' />
                    <Menu.Menu position='right'>
                        <Input icon='search' placeholder='Search drivers' value={this.state.searchString} onChange={(e, data) => this.onSearch(data.value)} />
                    </Menu.Menu>
                </Menu>
                {
                    this.state.searchString !== '' ?
                        <SearchDriversList drivers={drivers} toggleDriverSelection={toggleDriverSelection} serverRunning={serverRunning} searchString={this.state.searchString} />:
                        <FullDriversList groups={groups} drivers={drivers} toggleDriverSelection={toggleDriverSelection} serverRunning={serverRunning} />
                }

            </Container>
        )
    }
}

export default INDIServiceDriversPage
