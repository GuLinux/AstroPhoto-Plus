import React from 'react';
import { connect } from 'react-redux';
import { getDitheringOptionsSelector } from './selectors';
import { update } from '../Settings/actions';
import { Segment, Header, Form, Message, Accordion, Icon } from 'semantic-ui-react';
import { CheckboxSetting } from '../Settings/CheckboxSetting';
import { InputSetting } from '../Settings/InputSetting';


class DitheringOptionsComponent extends React.Component {
    state = { advancedSettingsShown: false };

    toggleAdvancedSettings = () => this.setState({ advancedSettingsShown: !this.state.advancedSettingsShown });

    renderDitheringOptions = () => (
        <React.Fragment>
            <InputSetting setting='dithering_pixels' number label='Dithering pixels' fluid labelPrefix='pixels' min={1} max={100} step={1} parse={parseInt} />
            <Message>Dither by the specified number of pixels after each exposure</Message>
            <Accordion fluid styled as={Form.Field}>
                <Accordion.Title active={this.state.advancedSettingsShown} index={0} onClick={this.toggleAdvancedSettings}>
                    <Header size='small'>
                        <Icon name='dropdown' className='dropdownRotationFix'/>
                        Advanced settings
                    </Header>
                </Accordion.Title>
                <Accordion.Content active={this.state.advancedSettingsShown}>
                    <CheckboxSetting label='Dither only in Right Ascension' setting='dithering_ra_only' toggle />
                    <InputSetting setting='dithering_settle_pixels' number label='Dithering settle pixels' fluid labelPrefix='pixels' min={1} max={30} step={0.1} />
                    <Message>After dithering, check that the star positions remains stable by the specified number of pixels</Message>
                    <InputSetting setting='dithering_settle_time' number label='Dithering settle time' fluid labelPrefix='seconds' min={1} max={30} step={1} parse={parseInt}/>
                    <Message>Wait at least the specified number of second for the guiding star to settle</Message>
                    <InputSetting setting='dithering_settle_timeout' number label='Dithering settle timeout' fluid labelPrefix='seconds' min={30} max={500} step={1} parse={parseInt} />
                    <Message>Maximum time in seconds to wait for the guiding star to settle</Message>
                </Accordion.Content>
            </Accordion>

        </React.Fragment>
    );

    render = () => (
        <Segment>
            <Header>Dithering options</Header>
            <Form>
                <CheckboxSetting label='Enable dithering' setting='dithering_enabled' toggle />
                {this.props.isDitheringEnabled && this.renderDitheringOptions()}
            </Form>
        </Segment>
    );
}

export const DitheringOptions = connect(getDitheringOptionsSelector, { update })(DitheringOptionsComponent);
