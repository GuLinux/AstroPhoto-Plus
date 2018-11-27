import React from 'react';
import { Celestial } from './Celestial';
import { Container, Menu } from 'semantic-ui-react';
import { get, set } from 'lodash';

export class CelestialControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: props.config,
        }
    }

    getConfig = (key, defaultValue) => get(this.state, `config.${key}`, defaultValue);
    setConfig = (key, value) => {
        const state = JSON.parse(JSON.stringify(this.state));
        set(state, `config.${key}`, value);
        this.setState(state);
    }

    render = () => (
        <Container fluid>
            <input type='range' min={-10} max={10} step={0.1} value={this.getConfig('zoom', 0)} onChange={e => this.setConfig('zoom', parseFloat(e.target.value))}/>
            <Celestial config={this.state.config}>
                {this.props.children}
            </Celestial>
        </Container>
    )
}