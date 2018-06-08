import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { matchPath, Route} from 'react-router';


const NavLinkItem = ({linkRef, label, match}) => { 
    return (
        <li className={!!match ? 'active' : ''}>
            <Link to={linkRef}>
                {label}
            </Link>
        </li>

    )
}

const NavLink = ({linkRef, label, disabled}) => {
    return disabled ? null : (
        <Route path={linkRef}>
            {({match}) => <NavLinkItem linkRef={linkRef} label={label}  match={match} />}
        </Route>
    );
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
        <NavLink linkRef="/sequences" label="Sequences" disabled={disabled} />
        <NavLink linkRef="/indi" label="INDI Server" disabled={disabled} />
    </Nav>
  </Navbar.Collapse>
</Navbar> 
)

export default Navigation;
