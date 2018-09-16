import { Route, Switch, Redirect } from 'react-router';
import React from 'react';

class HistoryLandingRoutes extends React.Component {

    componentDidUpdate = (prevProps) => {
        if(this.props.currentPath !== this.props.route && this.props.currentPath !== prevProps.currentPath) {
            this.props.setLandingPath(this.props.currentPath);
        }
    }

    render = () => (
        <Switch>
            <Route path={this.props.route} exact={true} render={() => <Redirect to={this.props.landingPath} />} />
            {this.props.children}
        </Switch>

    )
}

export const HistoryLandingPage = ({route, landingPath, children, setLandingPath}) => (
    <Route path={route} render={ ({location}) => <HistoryLandingRoutes route={route} currentPath={location.pathname} landingPath={landingPath} setLandingPath={setLandingPath} children={children} /> } />
)

