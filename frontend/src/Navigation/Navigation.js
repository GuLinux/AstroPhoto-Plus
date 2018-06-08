import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { matchPath, Route} from 'react-router';


export const NavLinkItem = ({linkRef, label, active, disabled}) => {
    return disabled ? null : (
        <li className={active ? 'active' : ''}>
            <Link to={linkRef}>
                {label}
            </Link>
        </li>
    );
}

export const ActiveRoute = ({path, children, ...rest}) => {
    return (
        <Route path={path} {...rest}>
            {({match}) => React.Children.map(children, child => React.cloneElement(child, {active: !!match})) }
        </Route>
    )
}

const Navigation = ({disabled, history}) => (
<Navbar inverse collapseOnSelect>
  <Navbar.Header>
    <Navbar.Brand>
      <a href="#home">StarQuew</a>
    </Navbar.Brand>
  <Navbar.Toggle />
  </Navbar.Header>
  <Navbar.Collapse>
    <Nav>
        <ActiveRoute path="/sequences"><NavLinkItem linkRef="/sequences" label="Sequences" disabled={disabled} /></ActiveRoute>
        <ActiveRoute path="/indi"><NavLinkItem linkRef="/indi" label="INDI Server" disabled={disabled} /></ActiveRoute>
    </Nav>
  </Navbar.Collapse>
</Navbar>
)

export default Navigation;
