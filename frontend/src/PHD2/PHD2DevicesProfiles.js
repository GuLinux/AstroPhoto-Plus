import React from 'react';
import { connect } from 'react-redux';
import { Form} from 'semantic-ui-react';
import { phd2ProfilesSelector } from './selectors';

const PHD2DevicesProfilesComponent = ({ profiles, selectedProfile, equipmentConnected }) => (
    <Form>
        <Form.Group inline>
            <Form.Dropdown options={profiles} value={selectedProfile} />
        </Form.Group>
    </Form>
);

export const PHD2DevicesProfiles = connect(phd2ProfilesSelector, {})(PHD2DevicesProfilesComponent);

