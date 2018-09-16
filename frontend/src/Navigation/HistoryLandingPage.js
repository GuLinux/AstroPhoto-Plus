import { Route, Switch, Redirect } from 'react-router';
import React from 'react';

class HistoryLandingRoutes extends React.Component {

    setLandingPath = () => {
        if(this.props.currentPath !== this.props.route) {
            this.props.setLandingPath(this.props.currentPath);
        }
    }

    componentDidMount = () => {
        this.setLandingPath();
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.currentPath !== prevProps.currentPath) {
            this.setLandingPath();
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

