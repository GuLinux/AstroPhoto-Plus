import React from 'react';

import { ModalDialog } from '../Modals/ModalDialog'; 
import { Form, Dimmer, List, Breadcrumb, Modal, Button, Loader, Message, Icon } from 'semantic-ui-react';

import { apiFetch } from '../middleware/api'

const AddFolderIcon = ({size='large'}) => (
    <Icon.Group size={size}>
        <Icon name='folder outline' />
        <Icon corner name='plus' />
    </Icon.Group>
)


const ErrorMessage = ({error}) => (
    <Message icon compact negative size='tiny'>
        <Icon name='warning' />
        <Message.Content>
            <Message.Header content={error.error} />
            {error.error_message}
            { error.mkdir && (
                <p>
                    <Button basic onClick={error.mkdir} content='create' icon={<AddFolderIcon />} />
                </p>
            )}
        </Message.Content>
    </Message>
);


class CreateDirectoryModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false, name: '' };
    }
    
    close = () => this.setState({...this.state, open: false, name: ''});

    mkdir = () => {
        this.props.mkdir(this.state.name);
        this.close();
    }

    render = () => (
        <Modal
            open={this.state.open}
            onOpen={() => this.setState({...this.state, open: true})}
            onClose={() => this.close()}
            trigger={this.props.trigger}
            size='small'
        >
            <Modal.Header content='New folder' />
            <Modal.Content>
                <Form>
                    <Form.Input
                        autoFocus
                        label='Directory name'
                        type='text'
                        placeholder='name'
                        value={this.state.name}
                        onChange={(e, data) => this.setState({...this.state, name: data.value})}
                    />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button content='Cancel' onClick={() => this.close()} />
                <Button content='Create' disabled={this.state.name === ''} onClick={() => this.mkdir()} />
            </Modal.Actions>
        </Modal>
    )
}

const DirectoryView = ({info, loading, onChanged}) => {
    if(!info)
        return null;
    const path = ['/'].concat(info.path.split('/').filter(p => p !== ''));

    const sections = path.map( (key, index) => ({
            key,
            content: key === '/' ? 'Root' : key,
            active: index+1 === path.length
        })
    );
    return (
        <React.Fragment>
            <Dimmer active={loading}>
                <Loader size='large' />
            </Dimmer>
            <Breadcrumb sections={sections} />
            <List size='large'>
            { info.subdirectories.map(d => <List.Item key={d} as='a' icon='folder' content={d} onClick={() => onChanged(info.path + '/' + d)} />
            )}
            </List>
        </React.Fragment>
    )
}

export class DirectoryPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPath: this.props.currentDirectory,
            loading: true,
        }
    }

    componentDidMount = () => {
        this.unmounted = false;
        this.state.currentPath && this.fetchDirectory();
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(this.state.currentPath !== prevState.currentPath) {
            this.fetchDirectory();
        }
    }

    onDataReceived = (newState) => {
        if(this.unmounted)
            return;
        this.setState({...this.state, ...newState, loading: false});
    }

    fetchDirectory = async () => {
        this.setState({...this.state, loading: true})
        try {
            let reply = await apiFetch('/api/directory_browser?path=' + this.state.currentPath);
            this.onDataReceived({keepError: false, payload: reply.json, error: this.state.keepError ? this.state.error : null});
        } catch(reply) {
            if(reply.response.status === 404) {
                let errorMessage = reply.json
                errorMessage.mkdir = () => this.mkdir({path: errorMessage.payload.requested_path});
                this.onDataReceived({error: errorMessage});
                if(errorMessage.payload && errorMessage.payload.redirect_to) {
                    this.setState({...this.state, currentPath: errorMessage.payload.redirect_to, keepError: true});
                }
            } else {
                let errorText = reply.json ? reply.json.error_message : reply.text;
                let errorTitle = reply.json ? reply.json.error : 'An error as occured';
                console.log('Error fetching directory ' + this.state.currentPath + ': ', reply);
                this.onDataReceived({error: { error: errorTitle, error_message: errorText }});
            }
        }
    }

    mkdir = async (payload) => {
        this.setState({...this.state, loading: true})
        let response = await fetch('/api/mkdir', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if(response.ok) {
            let data = await response.json();
            this.fetchDirectory();
        } else {
            let error;
            if(response.headers.has('content-type') && response.headers.get('content-type') === 'application/json') {
                error = await response.json();
            } else {
                let text = await response.text();
                error = { error: 'Error creating directory', error_message: text };
            }
            console.log('Error creating directory', error);
            this.onDataReceived({error, keepError: false});
        }

    }

    onDirectoryChanged = (path) => this.setState({...this.state, currentPath: path})
    hasParent = () => this.state && this.state.payload && this.state.payload.parent;
    goUp = () => this.onDirectoryChanged(this.state.payload.parent);

    render = () => (
        <ModalDialog trigger={this.props.trigger} centered={false} size='small'>
            <Modal.Header>Select directory</Modal.Header>
            <Modal.Content>
            { this.state.error  && <ErrorMessage error={this.state.error} /> }
            { this.state.payload && <DirectoryView info={this.state.payload} loading={this.state.loading} onChanged={this.onDirectoryChanged} /> }
            </Modal.Content>
            <Modal.Actions>
                { this.hasParent() && <Button icon='arrow alternate circle up' onClick={() => this.goUp()} content='Up' />}
                <CreateDirectoryModal
                    trigger={<Button icon={<AddFolderIcon size={null} />} content='Create folder' />}
                    mkdir={(name) => this.mkdir({parent: this.state.currentPath, name})}
                />
                <ModalDialog.CloseButton content='Cancel' />
                <ModalDialog.CloseButton
                    content='Select'
                    primary
                    onClose={() => this.props.onSelected(this.state.currentPath)}
                />
            </Modal.Actions>
        </ModalDialog>
    )

    componentWillUnmount = () => {
        this.unmounted = true;
    }
}
