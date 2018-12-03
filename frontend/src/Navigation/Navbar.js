import React from 'react';
import { Menu, Sidebar, Responsive } from 'semantic-ui-react';


import { NavbarMenuItemsContainer } from './NavbarMenuItemsContainer';
import { NavbarMenu } from './NavbarMenu';

const TRIGGER_SIZE = 1200;


const SiteMenuHeader = (props) => <Menu.Item header {...props} content='StarQuew' />

const DesktopNavbar = ({children}) => (
    <React.Fragment>
        <div className='fullHeight desktop-sidebar'>
            <NavbarMenu vertical attached className='fullHeight' size='small' fluid>
                <SiteMenuHeader />
                <NavbarMenuItemsContainer />
            </NavbarMenu>
        </div>
        <div className='desktop-content'>
        {children}
        </div>
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
        const { children } = this.props;
        return (
            <Sidebar.Pushable className='starquew-sidebar'>
                <Sidebar as={NavbarMenu} vertical animation='overlay' size='small' width='wide' direction='left' visible={this.state.visible} onHide={() => this.setVisible(false)}>
                    <SiteMenuHeader onClick={() => this.setVisible(false)} />
                    <NavbarMenuItemsContainer onClick={() => this.setVisible(false)} />
                </Sidebar>
                <Sidebar.Pusher style={{overflow: 'initial'}}>
                    <Menu inverted size='small' attached>
                        <SiteMenuHeader as='a' icon='sidebar' onClick={() => this.setVisible(true)} />
                    </Menu>
                    <div className='responsive-content'>
                        {children}
                    </div>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        )
    }
}


export const Navbar = ({location, children}) => (
     <React.Fragment>
        <Responsive maxWidth={TRIGGER_SIZE}>
             <ResponsiveNavbar children={children} />
        </Responsive>
        <Responsive minWidth={TRIGGER_SIZE + 1}>
            <DesktopNavbar children={children} />
        </Responsive>
     </React.Fragment>
)

