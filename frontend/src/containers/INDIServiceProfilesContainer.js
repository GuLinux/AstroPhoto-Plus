import { connect } from 'react-redux'
import Actions from '../actions'
import INDIServiceProfilesPage from '../components/INDIServiceProfilesPage'
import { unsortedListsEquals } from '../utils'

const mapStateToProps = (state, ownProps) => {
    const isProfileSelected = !!state.indiservice.profiles.find( profile => profile.id === state.indiservice.selectedProfile);
    const driversAreSelected = state.indiservice.selectedDrivers.length !== 0;

    return {
        profiles: state.indiservice.profiles,
        selectedProfile: state.indiservice.selectedProfile ? state.indiservice.selectedProfile : 'select',
        selectedProfileDriversChanged: state.indiservice.selectedProfile && ! unsortedListsEquals(state.indiservice.selectedDrivers, state.indiservice.profiles.find(p => p.id === state.indiservice.selectedProfile).devices),
        selectedDrivers: state.indiservice.selectedDrivers,
        selectedProfileName: state.indiservice.selectedProfile ? state.indiservice.profiles.find(p => p.id === state.indiservice.selectedProfile).name : '',
        canAddProfile: driversAreSelected,
        canRemoveProfile: isProfileSelected,
        canRenameProfile: isProfileSelected,
        selectedDrivers: state.indiservice.selectedDrivers,
    }
}

const mapDispatchToProps = dispatch => ({
    selectProfile: id => dispatch(Actions.INDIService.selectProfile(id === 'select' ? null : id)),
    addProfile: (name, drivers) => dispatch(Actions.INDIService.addProfile(name, drivers)),
    removeProfile: (id) => dispatch(Actions.INDIService.removeProfile(id)),
    updateProfile: (id, name, drivers) => dispatch(Actions.INDIService.updateProfile(id, name, drivers)),
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    addProfile: (name) => dispatchProps.addProfile(name, stateProps.selectedDrivers),
    removeProfile: () => dispatchProps.removeProfile(stateProps.selectedProfile),
    renameProfile: (name) => stateProps.selectedProfile && dispatchProps.updateProfile(stateProps.selectedProfile, name, stateProps.selectedDrivers),
    updateProfile: () => stateProps.selectedProfile && dispatchProps.updateProfile(stateProps.selectedProfile, stateProps.selectedProfileName, stateProps.selectedDrivers),
})

const INDIServiceProfilesContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(INDIServiceProfilesPage)

export default INDIServiceProfilesContainer
