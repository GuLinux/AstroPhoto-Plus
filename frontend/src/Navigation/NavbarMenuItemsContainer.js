import { connect } from 'react-redux';
import { hasConnectedCameras } from '../Gear/selectors';
import { NavbarMenuItems } from './NavbarMenuItems';

const mapStateToProps = state => ({
    disabled: state.errors.isError,
    hasConnectedCameras: hasConnectedCameras(state),
    sectionMenu: state.navigation.sectionMenu,
})

const mapDispatchToProps = dispatch => ({})


export const NavbarMenuItemsContainer = connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(NavbarMenuItems);

