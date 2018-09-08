import React from 'react';
import INDINumber from './INDINumber'
import INDIText from './INDIText';

import { Button, Grid } from 'semantic-ui-react'

export const CommitPendingValuesButton = ({isWriteable, commitPendingValues, ...args}) => {
    if(!isWriteable)
        return null;
    return (
        <Button
            {...args}
            onClick={e => commitPendingValues()}
            >set</Button>
    )
}

export const ChangePropertyButtons = ({ isWriteable, isEditMode, onCancelClicked, onEditClicked, commitPendingValues, ...buttonsArgs}) => {
    if(!isWriteable) {
        return null;
    }
    if(isEditMode) {
        return (
            <Button.Group {...buttonsArgs}>
                <CommitPendingValuesButton {...{ isWriteable, commitPendingValues } } />
                <Button onClick={onCancelClicked} content='cancel' />
            </Button.Group>
        );
    }
    return <Button onClick={onEditClicked} {...buttonsArgs} content='edit' />
};

class INDIInputProperty extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    editMode = (mode) => this.props.isWriteable && this.setState({...this.state, editMode: mode});

    render = () => {
        const { InputComponent, property, isWriteable, pendingValues, displayValues, addPendingValues, commitPendingValues } = this.props;
        const { editMode } = this.state;
        return (
            <Grid>
                <Grid.Column width={14}>
                    {property.values.map( (value, index) =>
                        <InputComponent key={index} value={value} addPendingValues={addPendingValues} displayValue={displayValues[value.name]} editMode={editMode} />
                    )}
                </Grid.Column>
                <Grid.Column width={2} verticalAlign='middle'>
                    <ChangePropertyButtons
                        isEditMode={editMode}
                        onCancelClicked={() => this.editMode(false)}
                        onEditClicked={() => this.editMode(true)}
                        primary
                        size="mini"
                        isWriteable={isWriteable}
                        commitPendingValues={(...args) => {
                            commitPendingValues(...args);
                            this.editMode(false);
                        }}
                    />
                </Grid.Column>
            </Grid>
        );
    }
}

export const INDINumberProperty = (props) => <INDIInputProperty {...props} InputComponent={INDINumber} />
export const INDITextProperty = (props) => <INDIInputProperty {...props} InputComponent={INDIText} />

