import { connect } from 'react-redux';
import { NavbarMenuItems } from './NavbarMenuItems';

const mapStateToProps = state => ({
    disabled: state.errors.isError,
})



export const NavbarMenuItemsContainer = connect(mapStateToProps, null, null, { pure: false })(NavbarMenuItems);

