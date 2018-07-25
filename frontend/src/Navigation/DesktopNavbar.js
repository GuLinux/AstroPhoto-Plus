import React from 'react';
import { Menu, Sidebar, Dropdown } from 'semantic-ui-react';
import { NavbarMenu, SiteMenuHeader, NavbarMenuItems } from './NavbarMenuItems';

export const DesktopNavbar = ({children, ...props}) => (
    <React.Fragment>
        <NavbarMenu>
            <SiteMenuHeader />
            <NavbarMenuItems {...props} />
        </NavbarMenu>
        {children}
    </React.Fragment>
);


