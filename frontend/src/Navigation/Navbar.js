import React from 'react';
import { Responsive } from 'semantic-ui-react';

import { DesktopNavbar } from './DesktopNavbar';
import { ResponsiveNavbar } from './ResponsiveNavbar';

const TRIGGER_SIZE = 768;


const Navbar = ({location, children}) => (
    <React.Fragment>
            <ResponsiveNavbar children={children} />
    </React.Fragment>
)

export default Navbar;
