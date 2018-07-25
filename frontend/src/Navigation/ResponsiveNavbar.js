import React from 'react';
import { NavbarMenu, SiteMenuHeader, NavbarMenuItems } from './NavbarMenuItems';
import { Menu, Sidebar, Dropdown } from 'semantic-ui-react';

export class ResponsiveNavbar extends React.Component {
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



