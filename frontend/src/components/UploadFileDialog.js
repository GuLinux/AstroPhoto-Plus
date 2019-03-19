import React from 'react';
import { Icon, Label, Modal, Grid } from 'semantic-ui-react'
import { ModalDialog } from '../Modals/ModalDialog';
import Dropzone from 'react-dropzone';


export class UploadFileDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onAcceptedFiles = acceptedFiles => {
        this.setState({...this.state, file: acceptedFiles && acceptedFiles.length === 1 ? acceptedFiles[0] : null });
    }

    render = () => {
        return (
            <ModalDialog trigger={this.props.trigger} basic size='mini' centered={false}>
                <Modal.Header>{this.props.title}</Modal.Header>
                <Modal.Content>
                    <Grid columns={1}>
                        <Grid.Row centered textAlign='center' verticalAlign='middle'>
                            <Dropzone accept={this.props.acceptMimeType} disablePreview={true} multiple={false} onDrop={this.onAcceptedFiles}>
                                {({getRootProps, getInputProps}) => (
                                    <div {...getRootProps()}>
                                        <Grid columns={1}>
                                            <Grid.Row centered textAlign='center' verticalAlign='middle'>
                                                <Icon name='upload' size='massive' />
                                            </Grid.Row>
                                            <Grid.Row centered textAlign='center' verticalAlign='middle'>
                                                Drop files here, or click to select
                                                <input {...getInputProps()} />
                                            </Grid.Row>
                                        </Grid>
                                    </div>
                                )}
                            </Dropzone>
                        </Grid.Row>
                        <Grid.Row centered textAlign='center' verticalAlign='middle'>
                            {this.state.file && <Label>{this.state.file.name}</Label>}
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <ModalDialog.CloseButton content='Cancel' />
                    <ModalDialog.CloseButton content='Upload' icon='upload' onClose={() => this.upload()} disabled={!this.state.file}/>
                </Modal.Actions>
            </ModalDialog>
        )
    }

    upload = () => {
        const file = this.state.file;
        this.setState({});
        const reader = new FileReader();
        reader.onload = () => {
            const fileBuffer = reader.result;
            this.props.onFileUploaded(fileBuffer);
        }
        this.props.readAsDataURL ? reader.readAsDataURL(file) : reader.readAsArrayBuffer(file);
    }
}

