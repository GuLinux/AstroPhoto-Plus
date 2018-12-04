import { connect } from 'react-redux'
import Settings from './Settings'
import Actions from '../actions'

const mapStateToProps = (state) => ({
    settings: state.settings,
    version: state.version && state.version.version,
    showCommands: state.commands.ids.length > 0 || state.commands.fetching,
});

const update = (key, value) => Actions.Settings.update({ [key]: value });

const mapDispatchToProps = {
    onChange: Actions.Settings.setPending,
    reset: Actions.Settings.resetPending,
    update,
}

const SettingsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Settings)

export default SettingsContainer
