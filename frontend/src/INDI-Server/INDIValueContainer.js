import React from 'react';
import { connect } from 'react-redux';
import { indiValueSelector } from './selectors';

const INDIValue = ({
    value,
    as: Child,
    valueId,
    property,
    device,
}) => <Child value={value} valueId={valueId} device={device} property={property} />;

export const INDIValueContainer = connect(indiValueSelector)(INDIValue);