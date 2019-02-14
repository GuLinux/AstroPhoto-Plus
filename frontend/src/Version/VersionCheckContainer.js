import { connect } from 'react-redux';
import { VersionCheck } from './VersionCheck';
import { versionCheckSelector } from './selectors';

export const VersionCheckContainer = connect(versionCheckSelector)(VersionCheck);
