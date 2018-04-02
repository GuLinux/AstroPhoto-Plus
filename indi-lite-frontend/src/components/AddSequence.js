import React from 'react'
import { Button } from 'react-bootstrap'
import AddSequenceModalContainer from '../containers/AddSequenceModalContainer'



class AddSequence extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
        }
    }

    toggleModal(modalVisible) {
        this.setState({...this.state, modalVisible});
    }

    render() {
        return (
            <div>
                <Button bsStyle="primary" bsSize="xsmall" onClick={() => this.toggleModal(true)}>new sequence</Button>
                <AddSequenceModalContainer show={this.state.modalVisible} closeModal={() => this.toggleModal(false)} />
            </div>
          )
    }
}

export default AddSequence
