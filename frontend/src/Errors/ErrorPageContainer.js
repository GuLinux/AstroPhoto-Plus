import { connect } from 'react-redux'
import ErrorPage from './ErrorPage'
import React from 'react'
import { errorPageSelector } from './selectors';

const ErrorPageContainer = ({isError, errorSource, errorPayload, children}) => {
    if(isError) {
        return <ErrorPage errorSource={errorSource} errorPayload={errorPayload} />
    }
    return children;
}



export default connect(errorPageSelector)(ErrorPageContainer)

