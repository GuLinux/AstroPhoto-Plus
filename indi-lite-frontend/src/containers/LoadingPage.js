import React from 'react'
import { connect } from 'react-redux'

let LoadingPage= ({ isLoading }) => {
    if(! isLoading)
        return null;
  return (
    <div className="loadingOverlay">
        <img src='/loading.gif' />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    isLoading: state.network.fetching
  }
}


LoadingPage = connect(mapStateToProps)(LoadingPage)

export default LoadingPage
