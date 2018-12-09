import { connect } from 'react-redux';
import { NavbarMenuItems } from './NavbarMenuItems';
import { navbarMenuItemsSelector } from './selectors';
import { withRouter } from 'react-router';

export const NavbarMenuItemsContainer = withRouter(connect(navbarMenuItemsSelector)(NavbarMenuItems));

