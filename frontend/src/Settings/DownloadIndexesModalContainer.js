import { connect } from 'react-redux';
import { DownloadIndexesModal } from './DownloadIndexesModal';
import { downloadIndexesSelector } from './selectors';
import Actions from '../actions';

export const DownloadIndexesModalContainer = connect(downloadIndexesSelector,{
    download: Actions.Settings.downloadIndexes,
    onClose: Actions.Settings.resetAstrometryDownloadIndexesStatus,
})(DownloadIndexesModal);

