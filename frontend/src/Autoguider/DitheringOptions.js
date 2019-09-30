import React from 'react';
import { connect } from 'react-redux';
import { getDitheringOptionsSelector } from './selectors';
import { update } from '../Settings/actions';
import { Segment, Header, Form, Message } from 'semantic-ui-react';
import { CheckboxSetting } from '../Settings/CheckboxSetting';
import { InputSetting } from '../Settings/InputSetting';


class DitheringOptionsComponent extends React.Component {
    renderDitheringOptions = () => (
        <React.Fragment>
            <InputSetting setting='dithering_pixels' number label='Dithering pixels' fluid labelPrefix='pixels' min={1} max={100} step={1} parse={parseInt} />
            <Message>Dither by the specified number of pixels after each exposure</Message>
            <Header size='small'>Advanced settings</Header>
            <CheckboxSetting label='Dither only in Right Ascension' setting='dithering_ra_only' toggle />
            <InputSetting setting='dithering_settle_pixels' number label='Dithering settle pixels' fluid labelPrefix='pixels' min={1} max={30} step={0.1} />
            <Message>After dithering, check that the star positions remains stable by the specified number of pixels</Message>
            <InputSetting setting='dithering_settle_time' number label='Dithering settle time' fluid labelPrefix='seconds' min={1} max={30} step={1} parse={parseInt}/>
            <Message>Wait at least the specified number of second for the guiding star to settle</Message>
            <InputSetting setting='dithering_settle_timeout' number label='Dithering settle timeout' fluid labelPrefix='seconds' min={30} max={500} step={1} parse={parseInt} />
            <Message>Maximum time in seconds to wait for the guiding star to settle</Message>

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
