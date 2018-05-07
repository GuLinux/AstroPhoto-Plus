import React from 'react'

const INDIServicePage = ({serverFound, serverRunning, onServerStopStartClick}) => {
    if(! serverFound)
        return null;
    const stateParams = {
        labelClass: serverRunning ? 'success' : 'danger',
        label: serverRunning ? 'running' : 'not running',
        buttonClass: serverRunning ? 'danger': 'success',
        buttonLabel: serverRunning ? 'stop' : 'start',
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-xs-2">Status</div>
                <div className="col-xs-2"><span className={'label label-' + stateParams.labelClass}>{stateParams.label}</span></div>
                <div className="col-xs-2"><Button bsSize="xsmall" bsStyle={stateParams.buttonClass} onClick={onServerStopStartClick}>{stateParams.buttonLabel}</Button></div>
            </div>
        </div>
    )
}

