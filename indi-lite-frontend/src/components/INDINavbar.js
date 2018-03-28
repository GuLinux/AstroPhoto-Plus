import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';


const INDINavbar = ({onSelected, section, disabled}) => (
<Navbar inverse collapseOnSelect>
  <Navbar.Header>
    <Navbar.Brand>
      <a href="#home">INDI Lite</a>
    </Navbar.Brand>
  <Navbar.Toggle />
  </Navbar.Header>
  <Navbar.Collapse>
    <Nav onSelect={onSelected}>
      <NavItem eventKey={'sessions'} active={section==='sessions'} href="#" disabled={disabled}>
        Sessions
      </NavItem>
      <NavItem eventKey={'indi_server'} active={section==='indi_server'} href="#" disabled={disabled}>
        INDI Server
      </NavItem>
    </Nav>
  </Navbar.Collapse>
</Navbar> 
)

export default INDINavbar;
