import React from 'react';
import { Message } from 'semantic-ui-react';

export const INDIMessagesPanel = ({messages}) => messages ? (
    <Message header='Messages' list={messages.map(m => m.message)} />
): null;

