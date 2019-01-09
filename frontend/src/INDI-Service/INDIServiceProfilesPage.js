import React from 'react'
import { Form, Menu, Container, Label, Dropdown, Modal } from 'semantic-ui-react';
import { ModalDialog } from '../Modals/ModalDialog';


class ProfileNameDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = { name: props.initialValue, open: false};
        this.modal = React.createRef();
    }

    hasChanged = () => this.state.name === this.props.initialValue;
    canSubmit = () => this.hasChanged && this.state.name !== '';

    componentDidUpdate(prevProps) {
        if(prevProps.initialValue !== this.props.initialValue)
            this.setState({...this.state, name: this.props.initialValue})
    }

    save = () => {
        this.props.onSave(this.state.name)
    }

    onProfileNameChanged = e => this.setState({...this.state, name: e.target.value});

    onKeyPress = ({key}) => {
        if(key === 'Enter' && this.canSubmit()) {
            this.save();
            this.modal.current.close();
        }
    }

    onKeyDown = ({key}) => {
        if(key === 'Escape') {
            this.modal.current.close();
        }
    }

    modalContent = () => (
        <Modal.Content>
            <Form>
                <Form.Input
                    type='text'
                    label='Profile name'
                    placeholder="Enter the profile name"
                    value={this.state.name}
                    onChange={this.onProfileNameChanged}
                    onKeyPress={this.onKeyPress}
                    onKeyDown={this.onKeyDown}
                    autoFocus
                />
            </Form>
        </Modal.Content>
    )

    render = () => (
        <ModalDialog trigger={this.props.trigger} centered={false} size='mini' basic ref={this.modal}>
            <Modal.Header content={this.props.title} />
            {this.modalContent()}
            <Modal.Actions>
                <ModalDialog.CloseButton content='Cancel' /> 
                <ModalDialog.CloseButton content={this.props.buttonText} positive disabled={!this.canSubmit()} onClose={this.save} /> 
            </Modal.Actions>
        </ModalDialog>
    )
}


class INDIServiceProfilesPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            editProfile: '',
        }
    }

    loadProfile = (profile) => () => this.props.loadProfile(profile === 'select' ? null : profile);
    addProfile = (name) => this.props.addProfile(name, this.props.selectedDrivers);
    renameProfile = id => name => this.props.updateProfile(id, name, this.props.profiles.find(p => p.id === id).drivers);
    updateProfile = (id) => () => this.props.updateProfile(id, undefined, this.props.selectedDrivers);
    removeProfile = id => () => this.props.removeProfile(id);

    renderProfileMenuItem = p => {
        const {
            driversAreSelected,
        } = this.props;

        return (
            <Dropdown item text={p.name} key={p.id} >
                <Dropdown.Menu> 
                    <Dropdown.Item icon='check' text='load' onClick={this.loadProfile(p.id)} />

                    <ProfileNameDialog initialValue={p.name} title='Rename profile' buttonText='Rename' trigger={
                        <Dropdown.Item icon='tag' text='rename'  />
                    } onSave={this.renameProfile(p.id)} />
                    <Dropdown.Item icon='save' disabled={!driversAreSelected} text='update' onClick={this.updateProfile(p.id)}/>
                    <Dropdown.Item icon='delete' text='remove' onClick={this.removeProfile(p.id)} />
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    render = () => {
        const {
            profiles,
            driversAreSelected,
        } = this.props;
        return (
            <Container>
                <Menu size='mini' stackable secondary>
                    <Menu.Item header>
                        {profiles.length === 0 ? 'No profiles' : 'Profiles'}
                        {driversAreSelected &&
                            <ProfileNameDialog
                                initialValue=''
                                title='New profile'
                                buttonText='Create'
                                trigger={<Label size='mini' icon='plus' content='add' basic as='a' />}
                                onSave={this.addProfile} />
                        }
                    </Menu.Item>
                    { profiles.map(this.renderProfileMenuItem)}
                </Menu>
            </Container>
        )
    }
}

export default INDIServiceProfilesPage;
