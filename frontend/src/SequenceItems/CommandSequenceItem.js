import React from 'react';
import { Form, Label, Divider } from 'semantic-ui-react';
import SequenceItemButtonsContainer from './SequenceItemButtonsContainer'

class CommandSequenceItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = { sequenceItem: {command: '', ...props.sequenceItem }}
    }

    isChanged() {
        return this.props.sequenceItem.command !== this.state.sequenceItem.command;
    }

    isValid() {
        return this.state.sequenceItem.command !== '';
    }

    onCommandChanged(command) {
        this.setState({...this.state, sequenceItem: {...this.state.sequenceItem, command } })
    }

    render() {
        return (
            <Form>
                <Form.Input
                    type='text'
                    label='Command to run'
                    value={this.state.sequenceItem.command}
                    onChange={e => this.onCommandChanged(e.target.value)}
                    placeholder='command line'
                />
                <Label size='tiny'>Run the specified command as a shell expression</Label>

                <Divider section />
                <SequenceItemButtonsContainer isValid={this.isValid()} isChanged={this.isChanged()} sequenceItem={this.state.sequenceItem} />
            </Form>
        )
    }
}

export default CommandSequenceItem
