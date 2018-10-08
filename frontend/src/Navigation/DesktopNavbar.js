import React from 'react';
import { Grid } from 'semantic-ui-react'; 
import { NavbarMenu, SiteMenuHeader } from './NavbarMenuItems';
import { NavbarMenuItemsContainer } from './NavbarMenuItemsContainer';

export const DesktopNavbar = ({children}) => (
    <Grid>
        <Grid.Column width={3}>
            <NavbarMenu vertical attached>
                <SiteMenuHeader />
                <NavbarMenuItemsContainer isVertical={true} />
            </NavbarMenu>
        </Grid.Column>
        <Grid.Column width={13}>
            {children}
        </Grid.Column>
    </Grid>
);


