import React from 'react';
import { Image, Container, Segment, Divider, List, Header } from "semantic-ui-react";
import { Link } from 'react-router-dom'
import { Routes } from '../routes';

export const Home = ({serverName, autoguiderEngine}) => (
    <Container>
        <Segment>
            <Image src='/images/site-logo-dark-bg.svg'/>
            { serverName && <Header size='small' icon='globe' content={serverName} /> }
            <Divider hidden />
            <p>AstroPhoto Plus is a lightweight, web based sequence generator and INDI client written in Python and React.</p>
            <p>AstroPhoto Plus allows you to start and manage an astrophotography sequence directly from your browser.</p>
        </Segment>
        <Segment>
            <List animated size='large' className='homeMenuList'>
                <List.Item>
                    <List.Icon name='list' />
                    <List.Content>
                        <List.Header as={Link} to={Routes.SEQUENCES_PAGE} content='Sequences' />
                        <List.Description>
                            Manage your astrophotography sequences.
                            With sequences you can run shots, rotate your electronic filter wheel, set device properties, and much more.
                            You can also add, remove, duplicate, export them.
                        </List.Description>
                    </List.Content>
                </List.Item>

                { autoguiderEngine === 'phd2' && (
                <List.Item>
                    <List.Icon name='dot circle outline' />
                    <List.Content>
                        <List.Header as={Link} to={Routes.PHD2} content='PHD2 Autoguider' />
                        <List.Description>
                            Simple integration with a running PHD2 autoguider instance.
                        </List.Description>
                    </List.Content>
                </List.Item>
                )}

                <List.Item>
                    <List.Icon name='camera' />
                    <List.Content>
                        <List.Header as={Link} to={Routes.CAMERA_PAGE} content='Camera' />
                        <List.Description>
                            Preview your field of view, refine focus, exposure, and get histogram information.
                        </List.Description>
                    </List.Content>
                </List.Item>

                <List.Item>
                    <List.Icon name='map outline' />
                    <List.Content>
                        <List.Header as={Link} to={Routes.PLATE_SOLVING_PAGE} content='Plate Solving' />
                        <List.Description>
                            Know where your camera is pointing, via an easy to use offline plate solved, powered by <a rel="noopener noreferrer" href='http://astrometry.net' target="_BLANK">astrometry.net</a>.
                        </List.Description>
                    </List.Content>
                </List.Item>

                <List.Item>
                    <List.Icon name='settings' />
                    <List.Content>
                        <List.Header as={Link} to={Routes.SETTINGS_PAGE} content='Settings' />
                        <List.Description>
                            Change various AstroPhoto Plus settings, such as images saving location. If supported by your platform, you will also find various commands available, for updating the app, or powering off the server.
                        </List.Description>
                    </List.Content>
                </List.Item>
            </List>
        </Segment>
        <Segment>
            <Container textAlign='center'>
                <List size='mini'>
                    <List.Item>
                        <List.Content>
                            AstroPhoto Plus - © <a rel="noopener noreferrer" href='http://gulinux.net' target='_BLANK'>Marco Gulino http://gulinux.net</a>.
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>
                            <a rel="noopener noreferrer" href='https://astrophotoplus.gulinux.net' target='_BLANK'>Project Homepage: https://astrophotoplus.gulinux.net</a>.
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>
                            <a rel="noopener noreferrer" href='https://www.github.com/GuLinux/AstroPhoto-Plus' target='_BLANK'>Github Project Page: https://www.github.com/GuLinux/AstroPhoto-Plus</a>.
                        </List.Content>
                    </List.Item>
                </List>
            </Container>
        </Segment>
    </Container>
);
