import React from 'react';
import { apiFetch } from '../middleware/api';

import { Modal, Container, Table, Button, Header } from 'semantic-ui-react';


const commandLine = (command) => {
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

    render = () => (
        <Table.Row>
            <Modal
                centered={false}
                size='large'
                basic
                open={this.state.showResult}
                onClose={() => this.update({showResult: false})}
                closeIcon
            >
                <Modal.Header content={'Result for command ' + this.props.command.name} />
                <Modal.Content>
                    <p>
                        Command {this.commandLine()} finished with exit code: {this.state.result && this.state.result.exit_code}.
                    </p>
                    {this.state.result && this.state.result.stdout && (
                        <React.Fragment>
                            <Header size='small' content='stdout' />
                            <pre>{this.state.result.stdout}</pre>
                        </React.Fragment>
                    )}
                    {this.state.result && this.state.result.stderr && (
                        <React.Fragment>
                            <Header size='small' content='stderr' />
                            <pre>{this.state.result.stderr}</pre>
                        </React.Fragment>
                    )}

                </Modal.Content>
            </Modal>
            <Table.Cell width={4}>{this.props.command.name}</Table.Cell>
            <Table.Cell width={8}>{this.commandLine()}</Table.Cell>
            <Table.Cell width={2}>
                <Button.Group size='mini'>
                    <Button
                        content='run'
                        disabled={this.state.running}
                        icon={this.state.running ? { name: 'spinner', loading: true } : { name: 'play' }}
                        onClick={() => this.run()}
                    />
                </Button.Group>
            </Table.Cell>
        </Table.Row>
    )

    update = (updated) => this.setState({...this.state, ...updated});

    run = async () => {
        this.update({ running: true });
        try {
            let reply = await apiFetch(`/api/commands/${this.props.command.id}/run`, { method: 'POST' });
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

export const Commands = ({commands, onError}) => commands && (
    <Container>
        <Table stackable>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Command</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                { commands.map(c => <Command onError={onError} command={c} key={c.id} />) }
            </Table.Body>
        </Table>
    </Container>
)
