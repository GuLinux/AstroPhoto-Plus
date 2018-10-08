import React from 'react';
import { Grid } from 'semantic-ui-react'; 
import { NavbarMenu, SiteMenuHeader } from './NavbarMenuItems';
import { NavbarMenuItemsContainer } from './NavbarMenuItemsContainer';

export const DesktopNavbar = ({children}) => (
    <Grid className='fullHeight'>
        <Grid.Column width={3} className='fullHeight'>
            <NavbarMenu vertical attached className='fullHeight'>
                <SiteMenuHeader />
                <NavbarMenuItemsContainer isVertical={true} />
            </NavbarMenu>
        </Grid.Column>
        <Grid.Column width={13}>
            {children}
        </Grid.Column>
    </Grid>
);


