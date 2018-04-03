import React from 'react'
import { Button } from 'react-bootstrap'


class ShowModalButton extends React.Component {
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
            <span className={this.props.className} >
                <Button bsStyle="primary" bsSize="xsmall" onClick={() => this.toggleModal(true)}>new sequence</Button>
                {this.props.createModal(this.state.modalVisible, () => this.toggleModal(false))}
            </span>
          )
    }
}

export default ShowModalButton
