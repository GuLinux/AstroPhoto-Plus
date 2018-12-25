import React from 'react';

import { Button, Grid } from 'semantic-ui-react'
import { get } from 'lodash/fp';
import { transform } from 'lodash';
import { INDINumberContainer, INDITextContainer } from './INDIValueContainer';
import { getValueName } from './utils';

class INDIInputProperty extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    editMode = mode => this.props.isWriteable && mode;

    displayValue = id => get(['pendingValues', getValueName(id)], this.state);

    onValueChange = (value) => this.setState({...this.state, pendingValues: {...this.state.pendingValues, ...value}});

    enterEditMode = () => this.setState({...this.state, editMode: this.editMode(true)});
    
    cancelEdit = () => {
        this.setState({
            ...this.state,
            pendingValues: {},
            editMode: this.editMode(false),
        });
    }

    commit = () => {
        this.props.setPropertyValues(
            this.props.device,
            this.props.property,
            this.state.pendingValues,
        );
        this.cancelEdit();
    }

    renderInputComponent = (value, index) => {
        const { InputComponent } = this.props;
        return <InputComponent key={index} valueId={value} onChange={this.onValueChange} displayValue={this.displayValue(value)} editMode={this.state.editMode} />
    }


    render = () => {
        const { property, isWriteable } = this.props;
        const { editMode } = this.state;

        return (
            <Grid>
                <Grid.Column width={11}>
                    {property.values.map(this.renderInputComponent)}
                </Grid.Column>
                <Grid.Column width={5} verticalAlign='middle'>
                    { isWriteable && (
                        <Button.Group size='mini'>
                        { editMode ? (
                            <React.Fragment>
                                <Button onClick={this.commit} content='set' icon='check' />
                                <Button onClick={this.cancelEdit} content='cancel' icon='cancel' />
                            </React.Fragment>
                            ) :
                            <Button onClick={this.enterEditMode} primary content='edit' icon='edit' />
                        }
                        </Button.Group>
                    )}
                </Grid.Column>
            </Grid>
        );
    }
}

export const INDINumberProperty = (props) => <INDIInputProperty {...props} InputComponent={INDINumberContainer} />
export const INDITextProperty = (props) => <INDIInputProperty {...props} InputComponent={INDITextContainer} />

