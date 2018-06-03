import React from 'react';
import ExposureSequenceItem from './ExposureSequenceItem'
import CommandSequenceItem from './CommandSequenceItem'
import FilterSequenceItemContainer from './FilterSequenceItemContainer'
import INDIPropertySequenceItemContainer from './INDIPropertySequenceItemContainer'

const mapItemType = (sequenceItem) => {
    switch(sequenceItem.type) {
        case 'shots':
            return <ExposureSequenceItem sequenceItem={sequenceItem} />;
        case 'filter':
            return <FilterSequenceItemContainer sequenceItem={sequenceItem} />;
        case 'command':
            return <CommandSequenceItem sequenceItem={sequenceItem} />
        case 'property':
            return <INDIPropertySequenceItemContainer sequenceItem={sequenceItem} />
        default:
            return null;
        }
}

const SequenceItem = ({sequenceItem}) => (
    <div className="container">{mapItemType(sequenceItem)}</div>
)

export default SequenceItem
