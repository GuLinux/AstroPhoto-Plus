import React from 'react';
import { Responsive } from 'semantic-ui-react';

import { DesktopNavbar } from './DesktopNavbar';
import { ResponsiveNavbar } from './ResponsiveNavbar';

const TRIGGER_SIZE = 768;


const Navbar = ({location, children}) => (
    <React.Fragment>
        <Responsive maxWidth={TRIGGER_SIZE}>
            <ResponsiveNavbar children={children} />
        </Responsive>
        <Responsive minWidth={TRIGGER_SIZE + 1}>
            <DesktopNavbar children={children} />
        </Responsive>
    </React.Fragment>
)

export default Navbar;
