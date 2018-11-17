import { connect } from 'react-redux';
import UploadFileDialog from '../components/UploadFileDialog';
import Actions from '../actions';


const mapStateToProps = state => ({
    title: 'Import Sequence',
    acceptMimeType: 'application/json',
});

const mapDispatchToProps = dispatch => ({
    onFileUploaded: (data) => dispatch(Actions.Sequences.import(String.fromCharCode.apply(null, new Uint8Array(data)))),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadFileDialog);


