import { connect } from 'react-redux'
import Actions from '../actions'
import INDIServiceProfilesPage from './INDIServiceProfilesPage'

const mapStateToProps = (state, ownProps) => {
    const driversAreSelected = state.indiservice.selectedDrivers.length !== 0;

    return {
        profiles: state.indiservice.profiles,
        selectedDrivers: state.indiservice.selectedDrivers,
        driversAreSelected,
    }
}

const mapDispatchToProps = dispatch => ({
    loadProfile: id => dispatch(Actions.INDIService.selectProfile(id === 'select' ? null : id)),
    addProfile: (name, drivers) => dispatch(Actions.INDIService.addProfile(name, drivers)),
    removeProfile: (id) => dispatch(Actions.INDIService.removeProfile(id)),
    updateProfile: (id, name, drivers) => dispatch(Actions.INDIService.updateProfile(id, name, drivers)),
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    addProfile: (name) => dispatchProps.addProfile(name, stateProps.selectedDrivers),
    renameProfile: (id, name) => dispatchProps.updateProfile(id, name, stateProps.profiles.find(p => p.id === id).drivers),
    updateProfile: (id) => dispatchProps.updateProfile(id, undefined, stateProps.selectedDrivers),
})

const INDIServiceProfilesContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(INDIServiceProfilesPage)

export default INDIServiceProfilesContainer
