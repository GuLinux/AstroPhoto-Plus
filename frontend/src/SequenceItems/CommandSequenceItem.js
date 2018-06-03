import React from 'react';
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
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
            <form className="container">
                <FormGroup controlId="command">
                    <ControlLabel>Command to run</ControlLabel>
                    <FormControl type="text" value={this.state.sequenceItem.command} onChange={ e => this.onCommandChanged(e.target.value) } />
                    <HelpBlock>Run the specified command as a shell expression</HelpBlock>
                </FormGroup>
                <SequenceItemButtonsContainer isValid={this.isValid()} isChanged={this.isChanged()} sequenceItem={this.state.sequenceItem} />
            </form>
        )
    }
}

export default CommandSequenceItem
