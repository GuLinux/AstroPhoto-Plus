import React from 'react';
import { apiFetch } from '../middleware/api';

import { Form, Confirm, Label, Message, Modal, Container, Grid, Button, Header } from 'semantic-ui-react';


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

class CommandEnvironmentModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { environment: {} }
        if(props.requestEnvironment) {
            props.requestEnvironment.variables.forEach( v => this.state.environment[v.name] = v.default_value || '' );
        }
    }

    canRun = () => {
        return this.props.requestEnvironment.variables
            .map( v => !v.required || (this.state.environment[v.name] && this.state.environment[v.name] !== ''))
            .reduce( (acc, cur) => acc &= cur, true)
        ;
    }

    render = () => {
        const { visible, commandName, requestEnvironment, onClose, onRun } = this.props;
        return requestEnvironment && (
            <Modal
                centered={false}
                size='large'
                basic
                open={visible}
                onClose={onClose}
            >
                <Modal.Header content={'Environment for ' + commandName} />
                <Modal.Content>
                    <Message content={requestEnvironment.message} />
                    <Form>{ requestEnvironment.variables.map( variable => (
                        <Form.Input
                            type={variable.type || "text"}
                            name={variable.name}
                            key={variable.name}
                            value={this.state.environment[variable.name]}
                            label={variable.label}
                            onChange={(e, data) => this.setState({...this.state, environment: { ...this.state.environment, [variable.name]: data.value } })}
                        />
                    ))}</Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button content='Cancel' onClick={() => onClose()} />
                    <Button content='Run' onClick={() => onRun(this.state.environment)} primary disabled={!this.canRun()}/>
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
                    onClose={() => this.update({showResult: false})}
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
                <CommandEnvironmentModal
                    commandName={command.name}
                    requestEnvironment={command.request_environment}
                    visible={this.state.showRequestEnvironment}
                    onClose={() => this.update({showRequestEnvironment: false})}
                    onRun={(environment) => this.run({environment}) }
                />
                    
                <Button
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

    run = async ({ confirmed=false, environment=null } = {}) => {
        if(!environment && !!this.props.command.request_environment) {
            this.update({ showRequestEnvironment: true });
            return;
        }
        if(!confirmed && this.props.command.confirmation_message) {
            this.update({ showConfirmation: true });
            return;
        }
        this.update({ running: true, showConfirmation: false, showRequestEnvironment: false });
        try {
            let reply = await apiFetch(`/api/commands/${this.props.command.id}/run`, {
                method: 'POST',
                body: JSON.stringify({ environment: environment || {}, timestamp: new Date() }),
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

const Category = ({category, commands, onError}) => (
    <Grid.Row>
        <Grid.Column verticalAlign='middle'><Label>{category}</Label></Grid.Column>
        <Grid.Column verticalAlign='middle'>
            <Button.Group size='small'>{
                commands.map(c => <Command onError={onError} key={c.id} command={c} />)
            }</Button.Group>
        </Grid.Column>
    </Grid.Row>
)

export const Commands = ({categories, onError}) => categories && (
    <Container>
        <Grid stackable>
            { Object.keys(categories).map(category => <Category onError={onError} key={category} category={category} commands={categories[category].commands} />) }
        </Grid>
    </Container>
)
