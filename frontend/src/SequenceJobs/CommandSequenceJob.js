import React from 'react';
import { Form, Label, Divider } from 'semantic-ui-react';
import SequenceJobButtonsContainer from './SequenceJobButtonsContainer'

class CommandSequenceJob extends React.Component {
    constructor(props) {
        super(props)
        this.state = { sequenceJob: {command: '', ...props.sequenceJob }}
    }

    isChanged() {
        return this.props.sequenceJob.command !== this.state.sequenceJob.command;
    }

    isValid() {
        return this.state.sequenceJob.command !== '';
    }

    onCommandChanged(command) {
        this.setState({...this.state, sequenceJob: {...this.state.sequenceJob, command } })
    }

    render() {
        return (
            <Form>
                <Form.Input
                    type='text'
                    label='Command to run'
                    value={this.state.sequenceJob.command}
                    onChange={e => this.onCommandChanged(e.target.value)}
                    placeholder='command line'
                />
                <Label size='tiny'>Run the specified command as a shell expression</Label>

                <Divider section />
                <SequenceJobButtonsContainer isValid={this.isValid()} isChanged={this.isChanged()} sequenceJob={this.state.sequenceJob} />
            </Form>
        )
    }
}

export default CommandSequenceJob
