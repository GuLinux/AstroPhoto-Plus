import React from 'react';
import { NavLink, Link, Route } from 'react-router-dom';
import { Menu } from 'semantic-ui-react'

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

const Navigation = ({disabled}) => (
    <Menu>
        <Menu.Item header>StarQuew</Menu.Item>
        <Menu.Item as={NavLink} to="/sequences" disabled={disabled}>Sequences</Menu.Item>
        <Menu.Item as={NavLink} to="/indi" disabled={disabled}>INDI Server</Menu.Item>
    </Menu>
)

export default Navigation;
