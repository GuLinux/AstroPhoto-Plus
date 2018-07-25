import React from 'react';
import { Responsive } from 'semantic-ui-react';

import { DesktopNavbarContainer, ResponsiveNavbarContainer } from './NavbarContainer';

const TRIGGER_SIZE = 768;


const Navbar = ({location, ...props}) => (
    <React.Fragment>
        <Responsive maxWidth={TRIGGER_SIZE}>
            <ResponsiveNavbarContainer {...props} />
        </Responsive>
        <Responsive minWidth={TRIGGER_SIZE + 1}>
            <DesktopNavbarContainer {...props} />
        </Responsive>
    </React.Fragment>
)

export default Navbar;
