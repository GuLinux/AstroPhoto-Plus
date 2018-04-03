import React from 'react';
import { Alert } from 'react-bootstrap';


const ErrorPage = ({errorSource, errorPayload}) => (
    <Alert bsStyle="danger">
        <h2>Server error</h2>
        <p>It looks like your backend server is not running, or encountered a fatal error.</p>
        <p>Please check your backend server is up and running, and try reloading this page.</p>
        <h3>Error details:</h3>
        <p>Error source: {errorSource}</p>
        <pre>{errorPayload}</pre>
    </Alert>
)

export default ErrorPage;
