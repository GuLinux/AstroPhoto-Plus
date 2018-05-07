import React from 'react';
import { Panel } from 'react-bootstrap';

const INDIDriver = ({driver, toggleDriverSelection, serverRunning }) => (
    <div className="checkbox">
        <label>
            <input type="checkbox" onChange={(e) => toggleDriverSelection(driver.name, e.target.checked)} checked={driver.selected} disabled={serverRunning} /> {driver.label}
        </label>
    </div>
)

class INDIDriversGroup extends React.Component {
    constructor(props) {
        super(props)
        this.state = { expanded: this.hasSelectedDrivers() }
    }

    toggle() {
        this.setState({...this.state, expanded: ! this.state.expanded })
    }

    hasSelectedDrivers() {
        return this.props.group.selectedDrivers.length > 0;
    }

    render() {
        return (
            <Panel expanded={this.state.expanded} onToggle={ () => this.toggle()} bsStyle={this.hasSelectedDrivers() ? 'primary' : 'default' }>
                <Panel.Heading>
                    <Panel.Title toggle className="driverGroupTitle">{this.props.group.name}</Panel.Title>
                </Panel.Heading>
                <Panel.Collapse>
                    <Panel.Body>
                        {
                            this.props.group.drivers.map((d, index) => (
                                <div key={index} className="col-xs-4">
                                    <INDIDriver driver={this.props.drivers[d]} toggleDriverSelection={this.props.toggleDriverSelection} serverRunning={this.props.serverRunning} />
                                </div>
                            ))
                        }
                    </Panel.Body>
                </Panel.Collapse>
            </Panel>
        )
    }
}


const INDIServiceDevicesPage = ({groups, drivers, serverFound, serverRunning, toggleDriverSelection}) => {
    if(! serverFound)
        return null;
    return (
        <div className="indi-service-page">
            { Object.keys(groups).map( group => <INDIDriversGroup key={group} group={groups[group]} drivers={drivers} toggleDriverSelection={toggleDriverSelection} serverRunning={serverRunning} />)}
        </div>
    )
}

export default INDIServiceDevicesPage
