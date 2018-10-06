import React from 'react';
import { NavbarMenu, SiteMenuHeader } from './NavbarMenuItems';
import { Menu, Sidebar } from 'semantic-ui-react';
import { NavbarMenuItemsContainer } from './NavbarMenuItemsContainer';

export class ResponsiveNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visible: false };
    }

    setVisible = (visible) => this.setState({...this.state, visible});

    toggleVisible = () => this.setVisible(! this.state.visible);

    render = () => {
        const { children } = this.props;
        return (
            <Sidebar.Pushable className='starquew-sidebar'>
                <Sidebar as={NavbarMenu} vertical animation='overlay' direction='left' visible={this.state.visible} onHide={() => this.setVisible(false)}>
                    <SiteMenuHeader onClick={() => this.setVisible(false)} />
                    <NavbarMenuItemsContainer isResponsive={true} onClick={() => this.setVisible(false)} />
                </Sidebar>
                <Sidebar.Pusher>
                    <Menu inverted color='white' size='large'>
                        <SiteMenuHeader onClick={() => this.setVisible(true)} />
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



