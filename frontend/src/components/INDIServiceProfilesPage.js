import React from 'react'
import { FormGroup, ControlLabel, FormControl, InputGroup, Button, Glyphicon } from 'react-bootstrap';
import { Dialog } from '../components/Dialogs'


class AddNewProfileDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = { name: '' };
    }

    render = () => (
        <Dialog name="newProfileName" title="New Profile name">
            <Dialog.Body>
                <FormGroup>
                    <FormControl type="text" placeholder="Enter the profile name" value={this.state.name} onChange={ (e) => this.setState({...this.state, name: e.target.value})} />
                </FormGroup>
            </Dialog.Body>
            <Dialog.Footer>
                <Dialog.Close modal="newProfileName">Cancel</Dialog.Close>
                <Dialog.Close disabled={this.state.name === ''} afterToggle={() => this.props.addProfile(this.state.name)} bsStyle="primary" modal="newProfileName">Create</Dialog.Close>
            </Dialog.Footer>
        </Dialog>
    )
}

const INDIServiceProfilesPage = ({profiles, selectedProfile, selectProfile, canAddProfile, canRemoveProfile, addProfile, removeProfile}) => (
    <form>
        <FormGroup controlId="formControlsSelect">
          <ControlLabel>Profiles</ControlLabel>
          <InputGroup>
              <FormControl componentClass="select" placeholder="select" value={selectedProfile} onChange={ e => selectProfile(e.target.value) }>
                <option value="select">select</option>
                { profiles.map(profile => <option key={profile.id} value={profile.id}>{profile.name}</option>)}
              </FormControl>
              <InputGroup.Button>
                <Dialog.Open modal="newProfileName" disabled={!canAddProfile}><Glyphicon glyph="plus" /></Dialog.Open>
              </InputGroup.Button>
              <InputGroup.Button>
                <Button disabled={!canRemoveProfile} onClick={removeProfile}><Glyphicon glyph="minus" /></Button>
              </InputGroup.Button>
        </InputGroup>
        </FormGroup>
        <AddNewProfileDialog addProfile={addProfile} />
    </form>
);

export default INDIServiceProfilesPage;
