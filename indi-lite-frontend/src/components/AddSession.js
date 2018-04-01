import React from 'react'
import { Button } from 'react-bootstrap'
import AddSessionModalContainer from '../containers/AddSessionModalContainer'



class AddSession extends React.Component {
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
                <Button bsStyle="primary" bsSize="xsmall" onClick={() => this.toggleModal(true)}>new session</Button>
                <AddSessionModalContainer show={this.state.modalVisible} closeModal={() => this.toggleModal(false)} />
            </div>
          )
    }
}

export default AddSession
