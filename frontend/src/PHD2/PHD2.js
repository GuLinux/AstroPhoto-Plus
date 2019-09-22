import React from 'react';
import { Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { phd2PageSelector } from './selectors';

const PHD2Component = () => (
    <Header content='PHD2' />
);

export const PHD2 = connect(phd2PageSelector, {})(PHD2Component);

