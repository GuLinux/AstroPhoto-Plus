import React from 'react';
import INDINumber from './INDINumber'
import INDIText from './INDIText';

import { Button, Grid } from 'semantic-ui-react'

class INDIInputProperty extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    editMode = (mode) => this.props.isWriteable && this.setState({...this.state, editMode: mode});


    commitPendingValues = args => {
        this.props.commitPendingValues();
        this.editMode(false);
    }

    render = () => {
        const { InputComponent, property, isWriteable, pendingValues, displayValues, addPendingValues } = this.props;
        const { editMode } = this.state;

        return (
            <Grid>
                <Grid.Column width={14}>
                    {property.values.map( (value, index) =>
                        <InputComponent key={index} value={value} addPendingValues={addPendingValues} displayValue={displayValues[value.name]} editMode={editMode} />
                    )}
                </Grid.Column>
                <Grid.Column width={2} verticalAlign='middle'>
                    { isWriteable && (
                        <Button.Group size='mini'>
                        { editMode ? (
                            <React.Fragment>
                                <Button onClick={() => this.commitPendingValues()} content='set' />
                                <Button onClick={() => this.editMode(false)} content='cancel' />
                            </React.Fragment>
                            ) :
                            <Button onClick={() => this.editMode(true)} primary content='edit' />
                        }
                        </Button.Group>
                    )}
                </Grid.Column>
            </Grid>
        );
    }
}

export const INDINumberProperty = (props) => <INDIInputProperty {...props} InputComponent={INDINumber} />
export const INDITextProperty = (props) => <INDIInputProperty {...props} InputComponent={INDIText} />

