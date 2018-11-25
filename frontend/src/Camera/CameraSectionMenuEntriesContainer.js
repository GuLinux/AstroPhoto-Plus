import { connect } from 'react-redux';
import { cameraImageOptionsSectionMenuEntriesSelector, cameraShootingSectionMenuEntriesSelector } from './selectors';
import { Actions } from '../actions';
import { CameraImageOptionsSectionMenuEntries, CameraShootingSectionMenuEntries } from './CameraSectionMenuEntries';

export const CameraShootingSectionMenuEntriesContaner = connect(
    cameraShootingSectionMenuEntriesSelector,
    dispatch => ({
        setOption: option => dispatch(Actions.Camera.setOption(option)),
        setCurrentCamera: camera => dispatch(Actions.Camera.setCamera(camera)),
        setCurrentFilterWheel: filterWheel => dispatch(Actions.Camera.setFilterWheel(filterWheel)),
    }),
)(CameraShootingSectionMenuEntries);

export const CameraImageOptionsSectionMenuEntriesContainer = connect(
    cameraImageOptionsSectionMenuEntriesSelector,
    dispatch => ({
        setOption: option => dispatch(Actions.Camera.setOption(option)),
        startCrop: () => dispatch(Actions.Camera.startCrop()),
        resetCrop: () => dispatch(Actions.Camera.resetCrop()),
    })
)(CameraImageOptionsSectionMenuEntries); 