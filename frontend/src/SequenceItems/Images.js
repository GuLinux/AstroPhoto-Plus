import React from 'react';
import { Table, Button, Container, Grid } from 'semantic-ui-react';
import Filesize from '../components/Filesize';
import Timestamp from '../components/Timestamp';
import { Link, withRouter } from 'react-router-dom';

const ImageRow = ({index, imageData}) => imageData ? (
    <Table.Row>
        <Table.Cell>{index+1}</Table.Cell>
        <Table.Cell><Link to={`/image/main/${imageData.id}`}>{imageData.filename}</Link></Table.Cell>
        <Table.Cell>{imageData.image_info.width}x{imageData.image_info.height}</Table.Cell>
        <Table.Cell><Filesize bytes={imageData.image_info.size} /></Table.Cell>
        <Table.Cell><Timestamp ts={imageData.timestamp} /></Table.Cell>
        <Table.Cell><a href={`/api/images/main/${imageData.id}?format=original&download=true`}>Download</a></Table.Cell>
    </Table.Row>
) : null;

class Images extends React.Component {
    constructor(props) {
        super(props);
        this.state = { imagesData: {}, previews: false };
    }

    componentWillMount = () => this.getImages();

    componentDidUpdate = (prevProps) => {
        if(prevProps.images !== this.props.images)
            this.getImages();
    }


    getImages = () => {
        if(!this.props.images)
            return;
        this.props.fetchImages( (imagesData) => this.setState({...this.state, imagesData}));
    }

    render = () => {
        const { images } = this.props;
        if(!images)
            return null;
        return (
            <Container>
                <Grid columns={16}>
                    <Grid.Row>
                        <Grid.Column width={16} textAlign='right'>
                            <Button.Group size='mini'>
                                <Button content='back' onClick={() => this.props.history.goBack() } />
                            </Button.Group>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Table stackable striped basic="very" selectable>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell />
                                    <Table.HeaderCell>Filename</Table.HeaderCell>
                                    <Table.HeaderCell>Resolution</Table.HeaderCell>
                                    <Table.HeaderCell>Size</Table.HeaderCell>
                                    <Table.HeaderCell>Date</Table.HeaderCell>
                                    <Table.HeaderCell>Download</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                { images.map( (image, index) => <ImageRow index={index} imageData={this.state.imagesData[image]} key={image} />)}
                            </Table.Body>
                        </Table>
                    </Grid.Row>
                </Grid>
            </Container>
        )
    }
}

export default withRouter(Images);
