import React from 'react';
import { Message, Button, Container } from 'semantic-ui-react';
import { withRouter } from 'react-router';

const NotFoundPage = withRouter( ({history, title = null, message= null, onBackClick = null, backToUrl = null, backButtonText = null}) => (
    <Container>
        <Message>
            <Message.Header content={title || 'Page not found'} />
            <Message.Content>
                <p>{message || "The requested page was not found on the server. You might be looking for a deleted element, or the server might not yet have updated its state. Please retry later, or go back"}</p>
                <Button onClick={() => {
                    if(onBackClick) {
                        onBackClick();
                    } else if(backToUrl) {
                        history.push(backToUrl);
                    } else {
                        history.goBack();
                    }
                }} content={backButtonText || 'Go back'} />
            </Message.Content>
        </Message>
    </Container>
))

export default NotFoundPage;

