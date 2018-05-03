import React from 'react';
import { Panel } from 'react-bootstrap';

const INDIDriver = ({driver}) => (
    <div class="checkbox">
        <label>
            <input type="checkbox" /> {driver.label}
        </label>
    </div>
)

const INDIDriversGroup = ({group, groups, drivers}) => (
    <Panel expanded={true}>
        <Panel.Heading>
            <Panel.Title toggle className="driverGroupTitle">{group.name}</Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
            <Panel.Body>
                {
                    group.drivers.map(d => (
                        <div className="col-xs-2">
                            <INDIDriver driver={drivers[d]} />
                        </div>
                    ))
                }
            </Panel.Body>
        </Panel.Collapse>
    </Panel>
)

const INDIServicePage = ({groups, drivers}) => (
        <div className="indi-service-page">
            { Object.keys(groups).map( group => <INDIDriversGroup key={group} group={groups[group]} drivers={drivers} />)}
        </div>
)

export default INDIServicePage
