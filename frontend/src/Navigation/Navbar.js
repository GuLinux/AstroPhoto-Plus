import React from 'react';
import { Menu, Sidebar, Responsive } from 'semantic-ui-react';


import { NavbarMenuItemsContainer } from './NavbarMenuItemsContainer';
import { NavbarMenu } from './NavbarMenu';

const TRIGGER_SIZE = 1200;


const SiteMenuHeader = (props) => <Menu.Item header {...props} content='StarQuew' />

class DesktopNavbar extends React.PureComponent {
    render = () => (
        <React.Fragment>
            <div className='fullHeight desktop-sidebar'>
                <NavbarMenu vertical attached className='fullHeight' size='small' fluid>
                    <SiteMenuHeader />
                    <NavbarMenuItemsContainer />
                </NavbarMenu>
            </div>
            <div className='desktop-content'>
                {this.props.children}
            </div>
        </React.Fragment>
    );
}

class ResponsiveNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visible: false };
    }

    setVisible = (visible) => this.setState({...this.state, visible});

    show = () => this.setVisible(true);
    hide = () => this.setVisible(false);

    render = () => {
        const { children } = this.props;
        return (
            <Sidebar.Pushable className='starquew-sidebar'>
                <Sidebar as={NavbarMenu} vertical animation='overlay' size='small' width='wide' direction='left' visible={this.state.visible} onHide={this.hide}>
                    <SiteMenuHeader onClick={this.hide} />
                    <NavbarMenuItemsContainer onClick={this.hide} />
                </Sidebar>
                <Sidebar.Pusher style={{overflow: 'initial'}}>
                    <Menu inverted size='small' attached>
                        <SiteMenuHeader as='a' icon='sidebar' onClick={this.show} />
                    </Menu>
                    <div className='responsive-content'>
                        {children}
                    </div>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        )
    }
}


export class Navbar extends React.PureComponent {
    render = () => (
         <React.Fragment>
            <Responsive maxWidth={TRIGGER_SIZE}>
                 <ResponsiveNavbar children={this.props.children} />
            </Responsive>
            <Responsive minWidth={TRIGGER_SIZE + 1}>
                <DesktopNavbar children={this.props.children} />
            </Responsive>
         </React.Fragment>
    );
}

