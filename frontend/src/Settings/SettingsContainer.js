import { connect } from 'react-redux'
import Settings from './Settings'
import Actions from '../actions'

const mapStateToProps = (state) => ({
    settings: state.settings,
    version: state.version && state.version.version,
    showCommands: state.commands.ids.length > 0 || state.commands.fetching,
});


const mapDispatchToProps = (dispatch, props) => ({
    onChange: (key, value) => dispatch(Actions.Settings.setPending(key, value)),
    reset: (key) => dispatch(Actions.Settings.resetPending(key)),
    update: (key, value) => dispatch(Actions.Settings.update({ [key]: value })),
})

const SettingsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Settings)

export default SettingsContainer
