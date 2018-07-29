import React from 'react';
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


