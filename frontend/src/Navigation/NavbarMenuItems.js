import React from 'react';
import { Menu, Sidebar, Dropdown } from 'semantic-ui-react';

import { NavLink } from 'react-router-dom';
export const NavbarMenu = (props) => <Menu stackable inverted color='grey' size='large' {...props} />
export const SiteMenuHeader = () => <Menu.Item header>StarQuew</Menu.Item>



export const NavItem = ({disabled, ...args}) => <Menu.Item disabled={disabled} as={disabled ? 'a' : NavLink} {...args} />

const pageNavItem = (item, index, Component) => {
    if(item.openModal) {
        const { openModal: ModalClass, modalProps = {}, ...props } = item;
        return <ModalClass trigger={<Component {...props} />} {...modalProps} key={index}/>
    }
    return <Component {...item} key={index} />
}

const pageMenuItems = (sectionMenu, itemComponent) => {
    let children = [];
    if(sectionMenu.navItems) {
        const menuItems = sectionMenu.navItems.map((item, index) => pageNavItem(item, index, itemComponent));
        children = children.concat(menuItems);
    }
    return children;
}

export const NavbarMenuItems = ({disabled, hasConnectedCameras, sectionMenu, isResponsive=false, onClick = () => true, version='N/A'}) => (
    <React.Fragment>
        <NavItem icon='list' content='Sequences' to="/sequences" disabled={disabled} onClick={onClick} />
        <NavItem icon='computer' content='INDI Server' to="/indi" disabled={disabled} onClick={onClick} />
        <NavItem icon='camera' content='Camera' to="/camera" disabled={disabled || ! hasConnectedCameras} onClick={onClick}/>
        <NavItem icon='settings' content='Settings' to="/settings" disabled={disabled} onClick={onClick} />
        { !isResponsive && (
            <Menu.Menu position='right'>
                { sectionMenu && (

                        <Dropdown item text={sectionMenu.section}>
                            <Dropdown.Menu>
                                {pageMenuItems(sectionMenu, Dropdown.Item)}
                            </Dropdown.Menu>
                        </Dropdown>

                )}
                <Dropdown item text='About'>
                    <Dropdown.Menu>
                        <Dropdown.Header content='StarQuew' />
                        <Dropdown.Item content={'Version: ' + version} />
                        <Dropdown.Item content='Author homepage' as='a' href='https://gulinux.net' target='_blank' />
                        <Dropdown.Item content='Github homepage' as='a' href='https://github.com/GuLinux/StarQuew' target='_blank' />
                        <Dropdown.Item content='Report an issue' as='a' href='https://github.com/GuLinux/StarQuew/issues' target='_blank' />
                    </Dropdown.Menu>
                </Dropdown>

            </Menu.Menu>
        )}
        { isResponsive && (
            <React.Fragment>
                { sectionMenu && (
                    <React.Fragment>
                        <Menu.Item header content={sectionMenu.section} />
                        {pageMenuItems(sectionMenu, Menu.Item)}
                    </React.Fragment>
                )}
                <Menu.Item header content='About StarQuew' />
                <Menu.Item content={'Version: ' + version} />
                <Menu.Item content='Author homepage' as='a' href='https://gulinux.net' target='_blank' />
                <Menu.Item content='Github homepage' as='a' href='https://github.com/GuLinux/StarQuew' target='_blank' />
                <Menu.Item content='Report an issue' as='a' href='https://github.com/GuLinux/StarQuew/issues' target='_blank' />

            </React.Fragment>
        )}
    </React.Fragment>
)


