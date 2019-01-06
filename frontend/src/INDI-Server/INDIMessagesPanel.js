import React from 'react';
import { Message } from 'semantic-ui-react';

export class INDIMessagesPanel extends React.Component {
    renderItem = ({message}, index) => <Message.Item key={index} content={message} />;
    render = () => this.props.messages ? (
        <Message>
            <Message.Header content='Messages' />
            <Message.List>
                 {this.props.messages.map(this.renderItem)}
            </Message.List>
        </Message>
    ) : null;
}
