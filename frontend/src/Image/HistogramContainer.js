import { connect } from 'react-redux';
import Histogram from './Histogram';
import Actions from '../actions';
import { histogramSelector } from './selectors';

const mapDispatchToProps = {
    loadHistogram: Actions.Image.loadHistogram,
}

const HistogramContainer = connect(
  histogramSelector,
  mapDispatchToProps
)(Histogram)


export default HistogramContainer;
