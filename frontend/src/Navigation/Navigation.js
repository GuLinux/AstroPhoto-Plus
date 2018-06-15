import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react'

const NavItem = ({disabled, ...args}) => <Menu.Item disabled={disabled} as={disabled ? 'a' : NavLink} {...args} />

const Navigation = ({disabled, hasConnectedCameras}) => (
    <Menu stackable inverted color='grey' size='large'>
        <Menu.Item header>StarQuew</Menu.Item>
        <NavItem content='Sequences' to="/sequences" disabled={disabled} />
        <NavItem content='INDI Server' to="/indi" disabled={disabled} />
        <NavItem content='Camera' to="/camera" disabled={disabled || ! hasConnectedCameras} />
    </Menu>
)

export default Navigation;
