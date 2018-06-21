import { connect } from 'react-redux'
import Settings from './Settings'
import Actions from '../actions'

const mapStateToProps = (state) => ({ settings: state.settings });


const mapDispatchToProps = (dispatch, props) => ({
})

const SettingsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Settings)

export default SettingsContainer
