import React from 'react';
import ExposureSequenceItem from './ExposureSequenceItem'

const mapItemType = (sequenceItem, saveSequenceItem) => {
    switch(sequenceItem.type) {
        case 'shots':
            return <ExposureSequenceItem sequenceItem={sequenceItem} saveSequenceItem={saveSequenceItem} />;
        default:
            return null;
        }
}

const SequenceItem = ({sequenceItem, saveSequenceItem}) => (
    <div className="container">{mapItemType(sequenceItem, saveSequenceItem)}</div>
)

export default SequenceItem
