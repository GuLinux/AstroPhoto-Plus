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

const mapDispatchToProps = {
    loadProfile: Actions.INDIService.selectProfile,
    addProfile: Actions.INDIService.addProfile,
    removeProfile: Actions.INDIService.removeProfile,
    updateProfile: Actions.INDIService.updateProfile,
};

const INDIServiceProfilesContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(INDIServiceProfilesPage)

export default INDIServiceProfilesContainer
