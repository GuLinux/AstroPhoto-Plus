import React from 'react';
import { apiFetch } from '../middleware/api';

import { Label, Message, Modal, Container, Grid, Button, Header } from 'semantic-ui-react';

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

    commandLine = () => {
        let cmdLine = this.props.command.program;
        if(this.props.command.arguments) {
            cmdLine += ' ' + this.props.command.arguments.join(' ');
        }
        return cmdLine;
    }

    render = () => { 
        const { result, showResult, running } = this.state;
        const { command } = this.props;

        const uiProperties = { icon: 'play', color: 'grey', ...(command.ui_properties || {}) };
        const { icon, ...buttonProps } = uiProperties;
        return (
            <React.Fragment>
                <CommandResultModal visible={showResult} onClick={() => this.update({showResult: false})} commandLine={this.commandLine()} commandName={command.name} />
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

    requestBody = () => {
        let request = {
            timestamp: new Date(),
        };
        return request;
    }

    run = async () => {
        this.update({ running: true });
        try {
            let reply = await apiFetch(`/api/commands/${this.props.command.id}/run`, {
                method: 'POST',
                body: JSON.stringify(this.requestBody()),
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
