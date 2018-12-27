import { connect } from 'react-redux';
import Histogram from './Histogram';
import Actions from '../actions';
import { getCurrentCamera } from './selectors';

const mapStateToProps = (state, ownProps) => {
    const camera = getCurrentCamera(state);
    const histogramEnabled = state.camera.options.showHistogram;
    const currentImage = state.camera.currentImage;
    if(!camera || ! histogramEnabled || ! currentImage)
        return {};
    return {
        histogramEnabled: true,
        camera: camera.id,
        image: currentImage.id,
        histogram: state.camera.histogram,
        logarithmic: state.camera.options.histogramLogarithmic,
        bins: state.camera.options.histogramBins,
    }
}

const mapDispatchToProps = {
    loadHistogram: Actions.Camera.loadHistogram,
}

const HistogramContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Histogram)


export default HistogramContainer;
