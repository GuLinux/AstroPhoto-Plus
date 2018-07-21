import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Sidebar, Responsive } from 'semantic-ui-react'

const NavItem = ({disabled, ...args}) => <Menu.Item disabled={disabled} as={disabled ? 'a' : NavLink} {...args} />

const NavbarMenuItems = ({disabled, hasConnectedCameras, rightMenu, onClick = () => true}) => (
    <React.Fragment>
        <NavItem icon='list' content='Sequences' to="/sequences" disabled={disabled} onClick={onClick} />
        <NavItem icon='computer' content='INDI Server' to="/indi" disabled={disabled} onClick={onClick} />
        <NavItem icon='camera' content='Camera' to="/camera" disabled={disabled || ! hasConnectedCameras} onClick={onClick}/>
        <NavItem icon='settings' content='Settings' to="/settings" disabled={disabled} onClick={onClick} />
        { rightMenu && (
            <Menu.Menu position='right'>
                {rightMenu}
            </Menu.Menu>
        )}
    </React.Fragment>
)

const NavbarMenu = (props) => <Menu stackable inverted color='grey' size='large' {...props} />
const SiteMenuHeader = () => <Menu.Item header>StarQuew</Menu.Item>

const NavbarDesktop = ({children, ...props}) => (
    <React.Fragment>
        <NavbarMenu>
            <SiteMenuHeader />
            <NavbarMenuItems {...props} />
        </NavbarMenu>
        {children}
    </React.Fragment>
);

class ResponsiveNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visible: false };
    }

    setVisible = (visible) => this.setState({...this.state, visible});

    toggleVisible = () => this.setVisible(! this.state.visible);

    render = () => {
        const {children, ...props} = this.props;
        return (
            <React.Fragment>
                <Menu inverted color='grey' size='large'>
                    <SiteMenuHeader />
                    <Menu.Menu position='right'>
                        <Menu.Item as='a' icon='sidebar' onClick={() => this.toggleVisible()} />
                    </Menu.Menu>
                </Menu>
                <Sidebar.Pushable>
                    <Sidebar as={NavbarMenu} animation='push' direction='top' visible={this.state.visible}>
                        <NavbarMenuItems {...props} onClick={() => this.setVisible(false)} />
                    </Sidebar>
                    <Sidebar.Pusher>
                        {children}
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </React.Fragment>
        )
    }
}



//const Navbar = (props) => <NavbarMenu {...props} />;

const Navbar = ({location, ...props}) => (
    <React.Fragment>
        <Responsive maxWidth={1129}>
            <ResponsiveNavbar {...props} />
        </Responsive>
        <Responsive minWidth={1130}>
            <NavbarDesktop {...props} />
        </Responsive>
    </React.Fragment>
)

export default Navbar;
