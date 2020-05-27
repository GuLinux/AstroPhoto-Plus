import { connect } from 'react-redux';
import { cameraImageOptionsSectionMenuEntriesSelector, cameraShootingSectionMenuEntriesSelector } from './selectors';
import { setOption, setCamera, setFilterWheel, startCrop, resetCrop } from './actions';
import { CameraImageOptionsSectionMenuEntries, CameraShootingSectionMenuEntries } from './CameraSectionMenuEntries';

export const CameraShootingSectionMenuEntriesContaner = connect(
    cameraShootingSectionMenuEntriesSelector,
    {
        setOption,
        setCamera,
        setFilterWheel,
    },
)(CameraShootingSectionMenuEntries);

export const CameraImageOptionsSectionMenuEntriesContainer = connect(
    cameraImageOptionsSectionMenuEntriesSelector, { 
        startCrop,
        resetCrop,
    })(CameraImageOptionsSectionMenuEntries); 
