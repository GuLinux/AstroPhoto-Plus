import React from 'react';
import { Message } from 'semantic-ui-react';

const INDIMessagesPanel = ({messages}) => messages ? (
    <Message header='Messages' list={messages.map(m => m.message)} />
): null;

export default INDIMessagesPanel;
