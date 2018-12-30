import { connect } from 'react-redux'
import Settings from './Settings'
import Actions from '../actions'
import { settingsSelector } from './selectors';

const update = (key, value) => Actions.Settings.update({ [key]: value });

const mapDispatchToProps = {
    onChange: Actions.Settings.setPending,
    reset: Actions.Settings.resetPending,
    update,
}

const SettingsContainer = connect(
    settingsSelector,
    mapDispatchToProps,
)(Settings)

export default SettingsContainer
