import { connect } from 'react-redux';
import UploadFileDialog from '../components/UploadFileDialog';
import Actions from '../actions';


const mapStateToProps = state => ({
    title: 'Import Sequence',
});

const mapDispatchToProps = dispatch => ({
    onFileUploaded: (data) => dispatch(Actions.Sequences.import(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadFileDialog);


