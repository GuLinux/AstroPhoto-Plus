import React from 'react';
import { Menu, Header } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

export const NavbarMenu = (props) => <Menu stackable inverted size='small' fluid {...props} />
export const NavItem = ({disabled, ...args}) => <Menu.Item disabled={disabled} as={disabled ? 'a' : NavLink} {...args} />

export const NavbarSectionMenu = ({sectionName, sectionText=null, children}) => (
                <Menu.Item>
                    <Header as='h4' content={sectionName} />
                    {sectionText && <i>{sectionText}</i> }
                    <Menu.Menu className='sectionMenu'>
                        {children}
                    </Menu.Menu>
                </Menu.Item>
)
