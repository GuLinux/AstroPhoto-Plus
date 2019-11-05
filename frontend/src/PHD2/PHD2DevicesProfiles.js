import React from 'react';
import { connect } from 'react-redux';
import { Form} from 'semantic-ui-react';
import { phd2ProfilesSelector } from './selectors';
import { phd2SetProfile, startPHD2Framing, startPHD2Guiding, stopPHD2Capture } from './actions';

class PHD2DevicesProfilesComponent extends React.Component {

    onProfileSelected = (evt, element) => this.props.phd2SetProfile(element.value);

    render = () => {
        const { profiles, selectedProfile, phd2State} = this.props;
        return (
            <Form>
                <Form.Group inline>
                    <Form.Dropdown options={profiles} value={selectedProfile} onChange={this.onProfileSelected} />
                    { phd2State === 'Stopped' && <Form.Button positive onClick={this.props.startPHD2Framing} >Start capturing</Form.Button> }
                    { ['Looping', 'Selected'].includes(phd2State)  && <Form.Button positive onClick={this.props.startPHD2Guiding} >Start autoguiding</Form.Button> }
                    { phd2State !== 'Stopped' && <Form.Button negative onClick={this.props.stopPHD2Capture} >Stop guiding/capturing</Form.Button> }
                </Form.Group>
            </Form>
        );
    }
}

export const PHD2DevicesProfiles = connect(phd2ProfilesSelector, {
    phd2SetProfile,
    startPHD2Framing,
    startPHD2Guiding,
    stopPHD2Capture,
})(PHD2DevicesProfilesComponent);

