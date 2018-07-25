import { connect } from 'react-redux';
import { hasConnectedCameras } from '../Gear/selectors';
import { DesktopNavbar } from './DesktopNavbar';
import { ResponsiveNavbar } from './ResponsiveNavbar';

const mapStateToProps = state => ({
    disabled: state.errors.isError,
    hasConnectedCameras: hasConnectedCameras(state),
    rightMenu: state.navigation.rightMenu,
})

const mapDispatchToProps = dispatch => ({})


export const DesktopNavbarContainer = connect(mapStateToProps, mapDispatchToProps)(DesktopNavbar)
export const ResponsiveNavbarContainer = connect(mapStateToProps, mapDispatchToProps)(ResponsiveNavbar)

