import { connect } from 'react-redux';
import { NavbarMenuItems } from './NavbarMenuItems';
import { navbarMenuItemsSelector } from './selectors';

export const NavbarMenuItemsContainer = connect(navbarMenuItemsSelector, null, null, { pure: false })(NavbarMenuItems);

