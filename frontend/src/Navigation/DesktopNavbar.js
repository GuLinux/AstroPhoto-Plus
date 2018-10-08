import React from 'react';
import { Grid, Container } from 'semantic-ui-react'; 
import { NavbarMenu, SiteMenuHeader } from './NavbarMenuItems';
import { NavbarMenuItemsContainer } from './NavbarMenuItemsContainer';

export const DesktopNavbar = ({children}) => (
    <Container fluid>
        <Grid>
            <Grid.Column width={3}>
                <NavbarMenu vertical>
                    <SiteMenuHeader />
                    <NavbarMenuItemsContainer isVertical={true} />
                </NavbarMenu>
            </Grid.Column>
            <Grid.Column width={13}>
                {children}
            </Grid.Column>
        </Grid>
    </Container>
);


