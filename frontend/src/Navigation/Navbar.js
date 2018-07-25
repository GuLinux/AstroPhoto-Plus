import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Sidebar, Responsive, Dropdown } from 'semantic-ui-react'

const NavItem = ({disabled, ...args}) => <Menu.Item disabled={disabled} as={disabled ? 'a' : NavLink} {...args} />

const pageNavItem = (item, index, Component) => {
    if(item.openModal) {
        const { openModal: ModalClass, modalProps = {}, ...props } = item;
        return <ModalClass trigger={<Component {...props} />} {...modalProps} key={index}/>
    }
    return <Component {...item} key={index} />
}

const pageMenuItems = (rightMenu, itemComponent) => {
    let children = [];
    if(rightMenu.navItems) {
        const menuItems = rightMenu.navItems.map((item, index) => pageNavItem(item, index, itemComponent));
        children = children.concat(menuItems);
    }
    return children;
}

const NavbarMenuItems = ({disabled, hasConnectedCameras, rightMenu, sectionMenu, onClick = () => true}) => (
    <React.Fragment>
        <NavItem icon='list' content='Sequences' to="/sequences" disabled={disabled} onClick={onClick} />
        <NavItem icon='computer' content='INDI Server' to="/indi" disabled={disabled} onClick={onClick} />
        <NavItem icon='camera' content='Camera' to="/camera" disabled={disabled || ! hasConnectedCameras} onClick={onClick}/>
        <NavItem icon='settings' content='Settings' to="/settings" disabled={disabled} onClick={onClick} />
        { rightMenu && (
            <Menu.Menu position='right'>
                <Dropdown item text={rightMenu.section}>
                    <Dropdown.Menu>
                        {pageMenuItems(rightMenu, Dropdown.Item)}
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Menu>
        )}
        { sectionMenu && (
            <React.Fragment>
                <Menu.Item header content={sectionMenu.section} />
                {pageMenuItems(sectionMenu, Menu.Item)}
            </React.Fragment>
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
        const {children, rightMenu, ...props} = this.props;
        if(! rightMenu) {
console.log(rightMenu);
}
        return (
            <Sidebar.Pushable>
                <Sidebar as={NavbarMenu} vertical animation='overlay' direction='left' visible={this.state.visible} onHide={() => this.setVisible(false)}>
                    <SiteMenuHeader />
                    <NavbarMenuItems sectionMenu={rightMenu} {...props} onClick={() => this.setVisible(false)} />
                </Sidebar>
                <Sidebar.Pusher>
                    <Menu inverted color='grey' size='large'>
                        <SiteMenuHeader />
                        <Menu.Menu position='right'>
                            <Menu.Item as='a' icon='sidebar' onClick={() => this.toggleVisible()} />
                        </Menu.Menu>
                    </Menu>
                    {children}
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        )
    }
}



//const Navbar = (props) => <NavbarMenu {...props} />;

const Navbar = ({location, ...props}) => (
    <React.Fragment>
        <Responsive maxWidth={768}>
            <ResponsiveNavbar {...props} />
        </Responsive>
        <Responsive minWidth={769}>
            <NavbarDesktop {...props} />
        </Responsive>
    </React.Fragment>
)

export default Navbar;
