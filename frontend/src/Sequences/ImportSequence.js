import React from 'react';
import { UploadFileDialog } from '../components/UploadFileDialog';


export class ImportSequence extends React.PureComponent {

    onFileUploaded = data => this.onFileUploaded(String.fromCharCode.apply(null, new Uint8Array(data)));

    render = () => <UploadFileDialog title='Import Sequence' acceptMimeType='application/json' onFileUploaded={this.onFileUploaded} trigger={this.props.trigger} />;
}

