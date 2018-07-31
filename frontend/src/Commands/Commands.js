import React from 'react';
import { apiFetch } from '../middleware/api';

import { Menu, Dimmer, Loader, Form, Confirm, Label, Message, Modal, Container, Grid, Button, Header } from 'semantic-ui-react';


const CommandConfirmationModal = ({ commandName, confirmationMessage, visible, onCancel, onConfirm }) => (
    <Confirm
        centered={false}
        basic
        open={visible}
        onCancel={onCancel}
        onConfirm={onConfirm}
        header={commandName}
    />
)

class CommandParametersModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { parameters: {} }
        if(props.requestParameters) {
            props.requestParameters.variables.forEach( v => this.state.parameters[v.name] = v.default_value || '' );
        }
    }

    canRun = () => {
        return this.props.requestParameters.variables
            .map( v => !v.required || (this.state.parameters[v.name] && this.state.parameters[v.name] !== ''))
            .reduce( (acc, cur) => acc &= cur, true)
        ;
    }

    buildParametersArray = () => this.props.requestParameters.variables.map(v => ({ name: v.name, value: this.state.parameters[v.name]}))

    render = () => {
        const { visible, commandName, requestParameters, onClose, onRun } = this.props;
        return requestParameters && (
            <Modal
                centered={false}
                size='large'
                basic
                open={visible}
                onClose={onClose}
            >
                <Modal.Header content={'Parameters for ' + commandName} />
                <Modal.Content>
                    <Message content={requestParameters.message} />
                    <Form>{ requestParameters.variables.map( variable => (
                        <Form.Input
                            type={variable.type || "text"}
                            name={variable.name}
                            key={variable.name}
                            value={this.state.parameters[variable.name]}
                            label={variable.label}
                            onChange={(e, data) => this.setState({...this.state, parameters: { ...this.state.parameters, [variable.name]: data.value } })}
                        />
                    ))}</Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button content='Cancel' onClick={() => onClose()} />
                    <Button content='Run' onClick={() => onRun(this.buildParametersArray())} primary disabled={!this.canRun()}/>
                </Modal.Actions>
            </Modal>
        );
    }
}



const CommandResultModal = ({commandName, commandLine, visible, onClose, result}) => {
    const isSuccess = result && result.exit_code === 0;
    return (
        <Modal
            centered={false}
            size='large'
            basic
            open={visible}
            onClose={onClose}
            closeIcon
        >
            <Modal.Header content={'Result for command ' + commandName} />
            <Modal.Content>
                <Message
                    positive={isSuccess}
                    negative={!isSuccess}
                >
                    Command {commandLine} finished with exit code: {result && result.exit_code}.
                </Message>
                {result && result.stdout && (
                    <React.Fragment>
                        <Header size='small' content='stdout' />
                        <pre>{result.stdout}</pre>
                    </React.Fragment>
                )}
                {result && result.stderr && (
                    <React.Fragment>
                        <Header size='small' content='stderr' />
                        <pre>{result.stderr}</pre>
                    </React.Fragment>
                )}

            </Modal.Content>
        </Modal>
    );
}


class Command extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    commandLine = () => this.props.command.arguments.join(' ');

    render = () => { 
        const { result, showResult, running } = this.state;
        const { command } = this.props;

        const uiProperties = { icon: 'play', color: 'grey', ...(command.ui_properties || {}) };
        const { icon, ...buttonProps } = uiProperties;
        return (
            <React.Fragment>
                <CommandResultModal
                    visible={showResult}
                    onClose={() => {
                        this.update({showResult: false});
                        this.props.refresh && this.props.refresh();
                    }}
                    commandLine={this.commandLine()}
                    commandName={command.name}
                    result={result}
                />
                <CommandConfirmationModal
                    commandName={command.name}
                    confirmationMessage={command.confirmation_message}
                    onCancel={() => this.update({showConfirmation: false})}
                    onConfirm={() => this.run({confirmed: true})}
                    visible={this.state.showConfirmation}
                />
                <CommandParametersModal
                    commandName={command.name}
                    requestParameters={command.request_parameters}
                    visible={this.state.showRequestParameters}
                    onClose={() => this.update({showRequestParameters: false})}
                    onRun={(parameters) => this.run({parameters}) }
                />
                    
                <Menu.Item
                    content={command.name}
                    disabled={running}
                    icon={running ? { name: 'spinner', loading: true } : { name: icon }}
                    onClick={() => this.run()}
                    {...buttonProps}
                />
            </React.Fragment>
        )
    }

    update = (updated) => this.setState({...this.state, ...updated});

    run = async ({ confirmed=false, parameters=null } = {}) => {
        if(!parameters && !!this.props.command.request_parameters) {
            this.update({ showRequestParameters: true });
            return;
        }
        if(!confirmed && this.props.command.confirmation_message) {
            this.update({ showConfirmation: true });
            return;
        }
        this.update({ running: true, showConfirmation: false, showRequestParameters: false });
        try {
            let reply = await apiFetch(`/api/commands/${this.props.command.id}/run`, {
                method: 'POST',
                body: JSON.stringify({ parameters: parameters || {}, timestamp: new Date() }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            this.update({ result: reply.json, running: false, showResult: true});
        } catch(err) {
            this.update({ running: false});
            let reply = err.json;
            if(! err.json) {
                reply = { error: 'Error running command ' + this.props.command.name, error_message: err.text };
            }
            const { error, error_message } = reply;
            this.props.onError(error, error_message);
        }
    }
}

const Category = ({category, commands, onError, refresh}) => (
    <Grid.Row>
        <Grid.Column width={2} verticalAlign='middle'><Label>{category}</Label></Grid.Column>
        <Grid.Column width={14} verticalAlign='middle'>
            <Menu stackable compact>{
                commands.map(c => <Command onError={onError} refresh={refresh} key={c.id} command={c} />)
            }</Menu>
        </Grid.Column>
    </Grid.Row>
)

export const Commands = ({categories, onError, refresh, fetching}) => (
    <Container>
        { categories && (
            <Grid stackable>
                { Object.keys(categories).map(category => <Category refresh={refresh} onError={onError} key={category} category={category} commands={categories[category].commands} />) }
            </Grid>
        )}
        { fetching && (
            <Dimmer active>
                <Loader />
            </Dimmer>
        )}
    </Container>
)
