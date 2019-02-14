import { connect } from 'react-redux';
import { Navbar } from './Navbar';
import { navbarContainerSelector } from './selectors';

export const NavbarContainer = connect(navbarContainerSelector)(Navbar);
