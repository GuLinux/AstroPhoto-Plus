import { Route, Switch, Redirect, withRouter } from 'react-router';
import React from 'react';

class HistoryLandingRoutes extends React.PureComponent {

    setLandingPath = () => {
        if(this.props.currentPath !== this.props.route) {
            this.props.setLandingPath(this.props.route, this.props.currentPath);
        }
    }

    componentDidMount = () => {
        this.setLandingPath();
        console.log('M', this.props.route, this.props.landingPath, this.props.currentPath)
    }

    componentDidUpdate = (prevProps) => {
        console.log('U', this.props.route, this.props.landingPath, this.props.currentPath)
        if(this.props.currentPath !== prevProps.currentPath) {
            this.setLandingPath();
        }
    }

    renderRedirect = () => <Redirect to={this.props.landingPath} />;

    render = () => (
        <Switch>
            <Route path={this.props.route} exact={true} render={this.renderRedirect} />
            {this.props.children}
        </Switch>

    )
}

export const HistoryLandingPage = withRouter(
    ({location, route, landingPath, children, setLandingPath}) => 
    <HistoryLandingRoutes
        location={location}
        route={route}
        currentPath={location.pathname}
        landingPath={landingPath}
        setLandingPath={setLandingPath}
        children={children} 
    /> 
); 
