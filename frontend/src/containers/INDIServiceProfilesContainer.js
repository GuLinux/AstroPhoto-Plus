import { connect } from 'react-redux'
import Actions from '../actions'
import INDIServiceProfilesPage from '../components/INDIServiceProfilesPage'


const mapStateToProps = (state, ownProps) => {
    const isProfileSelected = !!state.indiservice.profiles.find( profile => profile.id === state.indiservice.selectedProfile);
    const driversAreSelected = state.indiservice.selectedDrivers.length !== 0;
    
    return {
        profiles: state.indiservice.profiles,
        selectedProfile: state.indiservice.selectedProfile ? state.indiservice.selectedProfile : 'select',
        canAddProfile: driversAreSelected,
        canRemoveProfile: isProfileSelected,
        selectedDrivers: state.indiservice.selectedDrivers,
    }
}

const mapDispatchToProps = dispatch => ({
    selectProfile: id => dispatch(Actions.INDIService.selectProfile(id)),
    addProfile: (name, drivers) => dispatch(Actions.INDIService.addProfile(name, drivers)),
    removeProfile: (id) => dispatch(Actions.INDIService.removeProfile(id)),
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    addProfile: (name) => dispatchProps.addProfile(name, stateProps.selectedDrivers),
    removeProfile: () => dispatchProps.removeProfile(stateProps.selectedProfile),
})

const INDIServiceProfilesContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(INDIServiceProfilesPage)

export default INDIServiceProfilesContainer
