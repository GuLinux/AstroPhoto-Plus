import React from 'react';
import { Table } from 'react-bootstrap';

const INDIServerDevicesList = ({devices}) => {
    if(devices.length == 0)
        return null;
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                {devices.map(device => (
                    <tr>
                        <td>{device.name}</td>
                    </tr>
                ))}
            </tbody>
        </Table> 
    )
}
 
export default INDIServerDevicesList
