import React from 'react'
import { FormGroup, ControlLabel, FormControl, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { Dialog } from '../Modals/Dialogs'


class ProfileNameDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = { name: props.initialValue};
    }

    componentDidUpdate(prevProps) {
        if(prevProps.initialValue !== this.props.initialValue)
            this.setState({...this.state, name: this.props.initialValue})
    }

    render = () => (
        <Dialog name={this.props.name} title={this.props.title}>
            <Dialog.Body>
                <FormGroup>
                    <FormControl type="text" placeholder="Enter the profile name" value={this.state.name} onChange={ (e) => this.setState({...this.state, name: e.target.value})} />
                </FormGroup>
            </Dialog.Body>
            <Dialog.Footer>
                <Dialog.Button.Close modal={this.props.name}>Cancel</Dialog.Button.Close>
                <Dialog.Button.Close disabled={this.state.name === '' || this.state.name === this.props.initialValue} afterToggle={() => this.props.onAccepted(this.state.name)} bsStyle="primary" modal={this.props.name}>{this.props.buttonText}</Dialog.Button.Close>
            </Dialog.Footer>
        </Dialog>
    )
}


const INDIServiceProfilesPage = ({
    profiles,
    selectedProfile,
    selectProfile,
    canAddProfile,
    canRemoveProfile,
    addProfile,
    canRenameProfile,
    removeProfile,
    updateProfile,
    selectedProfileDriversChanged,
    renameProfile,
    selectedProfileName
}) => (
    <form>
        <FormGroup controlId="formControlsSelect">
            <ControlLabel>Profiles</ControlLabel>
            <InputGroup>
                <FormControl componentClass="select" placeholder="select" value={selectedProfile} onChange={ e => selectProfile(e.target.value) }>
                    <option value="select">select</option>
                    { profiles.map(profile => <option key={profile.id} value={profile.id}>{profile.name}</option>)}
                </FormControl>
                <DropdownButton componentClass={InputGroup.Button} id="input-dropdown-addon" title="..." >
                    <Dialog.MenuItem.Open key="newprofile" modal="newProfileDialog" disabled={!canAddProfile}>new</Dialog.MenuItem.Open>
                    <Dialog.MenuItem.Open key="renameprofile" modal="renameProfileDialog" disabled={!canRenameProfile}>rename</Dialog.MenuItem.Open>
                    <MenuItem key="updateProfile" disabled={!selectedProfileDriversChanged} onSelect={updateProfile}>update</MenuItem>
                    <MenuItem key="removeProfile" disabled={!canRemoveProfile} onSelect={removeProfile}>remove</MenuItem>
                </DropdownButton>
            </InputGroup>
        </FormGroup>
        <ProfileNameDialog name="newProfileDialog" title="New profile" initialValue="" onAccepted={addProfile} buttonText="Create" />
        <ProfileNameDialog name="renameProfileDialog" title="Rename profile" initialValue={selectedProfileName} onAccepted={renameProfile} buttonText="Rename" />
    </form>
);

export default INDIServiceProfilesPage;
