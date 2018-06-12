import React from 'react';
import { Message } from 'semantic-ui-react';

const INDIMessagesPanel = ({messages}) => (
    <Message header='Messages' list={messages.reverse().map(m => m.message)} />
);

export default INDIMessagesPanel;
