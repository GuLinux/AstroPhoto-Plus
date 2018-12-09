import React from 'react'
import { Form, Menu, Container, Label, Dropdown, Modal} from 'semantic-ui-react';


class ProfileNameDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = { name: props.initialValue, open: false};
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

    modalContent = () => (
        <Modal.Content>
            <Form>
                <Form.Input
                    type='text'
                    label='Profile name'
                    placeholder="Enter the profile name"
                    value={this.state.name}
                    onChange={ (e) => this.setState({...this.state, name: e.target.value})}
                    autoFocus
                />
            </Form>
        </Modal.Content>
    )

    render = () => {
        const { trigger, title } = this.props;
        const actions = [
            'Cancel',
            { key: 'submit', content: this.props.buttonText, positive: true, disabled: !this.canSubmit(), onClick: () => this.save() }
        ];
        return (
            <Modal trigger={trigger} centered={false} size='mini' basic content={this.modalContent()} header={title} actions={actions} />
        )
    }
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
            <Dropdown item text={p.name} key={p.id} simple>
                <Dropdown.Menu direction='left'>
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
                        <ProfileNameDialog initialValue='' title='New profile' buttonText='Create' trigger={
                            driversAreSelected ?
                            <Label size='mini' icon='plus' content='add' basic as='a' />
                            : null
                        } onSave={this.addProfile} />

                    </Menu.Item>
                    { profiles.map(this.renderProfileMenuItem)}
                </Menu>
            </Container>
        )
    }
}

export default INDIServiceProfilesPage;
