import { connect } from 'react-redux';
import { NavbarMenuItems } from './NavbarMenuItems';

const mapStateToProps = state => ({
    disabled: state.errors.isError,
})

const mapDispatchToProps = dispatch => ({})


export const NavbarMenuItemsContainer = connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(NavbarMenuItems);

