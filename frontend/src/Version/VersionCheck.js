import React from 'react';

export class VersionCheck extends React.Component {
    reloadApp = () => this.props.needsRefresh && window.location.reload(true);

    componentDidMount = () => this.reloadApp();
    componentDidUpdate = () => this.reloadApp();

    render = () => null;
}
