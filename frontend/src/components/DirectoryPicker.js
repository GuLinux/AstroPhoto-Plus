import React from 'react';

import { ModalDialog } from '../Modals/ModalDialog'; 
import { Dimmer, List, Breadcrumb, Modal, Button, Loader, Message } from 'semantic-ui-react';

import fetch from 'isomorphic-fetch'

const ErrorMessage = ({error}) => (
    <Message />
);

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
            { info.parent && <Button size='mini' icon='arrow alternate circle up' onClick={() => onChanged(info.parent)}/>}
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
        let response = await fetch('/api/directory_browser?path=' + this.state.currentPath);
        if(response.ok) {
            let data = await response.json();
            this.onDataReceived({payload: data});
        } else {
            if(response.status === 404) {
                let errorMessage = await response.json();
                this.onDataReceived({error: errorMessage});
            } else {
                let errorText = await response.text();
                console.log('Error fetching directory ' + this.state.currentPath + ': ', response, errorText);
                this.onDataReceived({error: { error: 'An error has occured', error_message: errorText }});
            }
        }
    }

    onDirectoryChanged = (path) => this.setState({...this.state, currentPath: path})

    render = () => (
        <ModalDialog trigger={this.props.trigger} centered={false} size='small'>
            <Modal.Header>Select directory</Modal.Header>
            <Modal.Content>
            { this.state.error ?
                <ErrorMessage error={this.state.error} /> :
                <DirectoryView info={this.state.payload} loading={this.state.loading} onChanged={this.onDirectoryChanged} />
            }
            </Modal.Content>
            <Modal.Actions>
                <ModalDialog.CloseButton content='Cancel' />
                <ModalDialog.CloseButton
                    content='Select'
                    primary
                    disabled={this.state.currentPath === this.props.currentDirectory}
                    onClose={() => this.props.onSelected(this.state.currentPath)}
                />
            </Modal.Actions>
        </ModalDialog>
    )

    componentWillUnmount = () => {
        this.unmounted = true;
    }
}
