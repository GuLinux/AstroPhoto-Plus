import React from 'react';
import { Message, Button } from 'semantic-ui-react'
import { withRouter } from 'react-router';

const ErrorPage = withRouter( ({history, location, errorSource, errorPayload}) => (
    <Message error>
        <Message.Header>Server error</Message.Header>
        <p>It looks like your backend server is not running, or encountered a fatal error.</p>
        <p>Please check your backend server is up and running, and try reloading this page.</p>
        <Button onClick={() => window.location.reload()} content='Reload' icon='sync'/>
        <h3>Error details:</h3>
        <p>Error source: {errorSource}</p>
        <pre>{errorPayload}</pre>
    </Message>
)
)

export default ErrorPage;
