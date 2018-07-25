import React from 'react';
import { Menu, Sidebar, Dropdown } from 'semantic-ui-react';
import { NavbarMenu, SiteMenuHeader } from './NavbarMenuItems';
import { NavbarMenuItemsContainer } from './NavbarMenuItemsContainer';

export const DesktopNavbar = ({children}) => (
    <React.Fragment>
        <NavbarMenu>
            <SiteMenuHeader />
            <NavbarMenuItemsContainer />
        </NavbarMenu>
        {children}
    </React.Fragment>
);


