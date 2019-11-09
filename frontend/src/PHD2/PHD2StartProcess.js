import React from 'react';
import { connect } from 'react-redux';
import { Message, Button, Dropdown, Input } from 'semantic-ui-react';
import { apiFetch } from '../middleware/api';
import { phd2ProcessSelector } from './selectors';
import { startPHD2, stopPHD2 } from './actions';

export class PHD2StartProcessComponent extends React.Component {
    state = { x11Displays: [], x11Display: null, phd2_path: '/usr/bin/phd2' };

    fetchX11Displays = async () => {
        if(this.props.connected) {
            return;
        }
        const { json: displays } = await apiFetch('/api/x11_displays');
        this.setState({
            x11Displays: displays.map( ({display_variable}) => ({ key: display_variable, value: display_variable, text: display_variable })),
        });
    }

    componentDidMount = () => {
        this.fetchX11Displays();
        this.setFetchDisplaysTimer();
    }

    setFetchDisplaysTimer = () => {
        this.fetchDisplaysInterval = setInterval(this.fetchX11Displays, 5000); // a simple timeout should be sufficient, as it's a simple API
    }

    clearFetchDisplaysTimer = () => {
        clearInterval(this.fetchDisplaysInterval);
        this.fetchDisplaysInterval = null;
    }

    componentDidUpdate = prevProps => {
        if(prevProps.processRunning !== this.props.processRunning) {
            if(this.props.processRunning) {
                this.clearFetchDisplaysTimer();
            } else {
                this.setFetchDisplaysTimer();
            }
        }
    }

    componentWillUnmount = () => {
        this.clearFetchDisplaysTimer();
    }

    onDisplaySelected = (evt, { value: x11Display}) => this.setState({ x11Display });

    onPathChanged = (evt, {value: phd2_path}) => !this.props.processRunning && this.setState({ phd2_path });

    startPHD2 = () => this.props.startPHD2(this.state.phd2_path, this.state.x11Display);

    render = () => this.state.x11Displays.length > 0 ? (
        <Input
            type='text'
            size='small'
            fluid
            labelPosition='right'
            value={this.state.phd2_path}
            onChange={this.onPathChanged}
        >
            <Dropdown button floating value={this.state.x11Display} onChange={this.onDisplaySelected} options={this.state.x11Displays} placeholder='X11 Display' disabled={this.props.processRunning} />
            <input />
            {this.props.processRunning ? this.renderStop() : this.renderStart()}
        </Input>
    ) : (
        <Message>
            <Message.Header>No X11 Displays detected</Message.Header>
            <p>In order to start and run PHD2 you need to have a running X11 or vnc server. Please consult your distribution user manual in order to get one running.</p>
            <p>You can also visit <a href='https://astrophotoplus.gulinux.net' target='_blank'>AstroPhoto Plus</a> homepage for more tips about PHD2 and X11 servers.</p>
        </Message>
    );

    renderStop = () => <Button negative content='Stop' onClick={this.props.stopPHD2} />
    renderStart= () => <Button positive content='Run' onClick={this.startPHD2} disabled={!this.state.x11Display || ! this.state.phd2_path} />
}


export const PHD2StartProcess = connect(phd2ProcessSelector, { startPHD2, stopPHD2 })(PHD2StartProcessComponent);

