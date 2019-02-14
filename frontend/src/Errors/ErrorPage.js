import React from 'react';
import { Icon, Segment, Container, Image, Message, Button } from 'semantic-ui-react'
import { withRouter } from 'react-router';
import { isDevelopmentMode } from '../utils';

const OfflineMessage = () => (
    <Message icon>
        <Icon name='info' />
        <Message.Content>
            <Message.Header>Offline</Message.Header>
            <p>It looks like the backend server is not running.</p>
            <p>The application will reload as soon as connection will be established again.</p>
            <p>If that doesn't happen, please either check your network connection, that the server is connected and running, and server logs using the following command:</p>
            <pre>AstroPhotoPlus-ctl logs</pre>
        </Message.Content>
    </Message>
);

const ErrorMessage = ({errorPayload, errorSource}) => (
    <Message error>
        <Message.Header>Server error</Message.Header>
        <p>It looks like your backend server is not running, or encountered a fatal error.</p>
        <p>Please check your backend server is up and running, and try reloading this page.</p>
        <Button onClick={() => window.location.reload()} content='Reload' icon='sync'/>
        <h3>Error details:</h3>
        <p>Error source: {errorSource}</p>
        <pre>{errorPayload}</pre>
    </Message>
);

const ErrorPage = withRouter( ({history, location, errorSource, errorPayload}) => (
    <Container>
        <Segment>
            <Image src='/images/site-logo-dark-bg.svg'/>
            { isDevelopmentMode ? <ErrorMessage errorSource={errorSource} errorPayload={errorPayload} /> : <OfflineMessage /> }
        </Segment>
    </Container>
));

export default ErrorPage;
