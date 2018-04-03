import React from 'react';
import PagesListContainer from '../containers/PagesListContainer';
import SequenceContainer from '../containers/SequenceContainer';
import SequencesListContainer from '../containers/SequencesListContainer';
import AddSequenceModalContainer from '../containers/AddSequenceModalContainer';
import { Button } from 'react-bootstrap';

class SequencesPage extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = { showNewSequenceModal: false };
    }

    render() {
        return (
            <div className="sequences container-fluid">
                <PagesListContainer navigationKey="sequencePage">
                    <div key="sequences">
                        <Button bsStyle="primary" bsSize="xsmall" className="pull-right" onClick={() => this.setState({...this.state, showNewSequenceModal: true})}>new sequence</Button>
                        <AddSequenceModalContainer show={this.state.showNewSequenceModal} closeModal={() => this.setState({...this.state, showNewSequenceModal: false }) } />
                        <SequencesListContainer />
                    </div>
                    <SequenceContainer key="sequence" />
                </PagesListContainer>
            </div>
        )
    }
}

export default SequencesPage;


