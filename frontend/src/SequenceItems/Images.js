import React from 'react';
import { Table, Button, Container, Grid, Image, Header } from 'semantic-ui-react';
import Filesize from '../components/Filesize';
import DateTime from '../components/DateTime';
import { Link, withRouter } from 'react-router-dom';

const ImageRow = ({index, imageData, previews}) => imageData ? (
    <Table.Row>
        <Table.Cell>{index+1}</Table.Cell>
        {previews && (
            <Table.Cell>
                <Image src={`/api/images/main/${imageData.id}?format=jpeg&maxwidth=128`} />
            </Table.Cell>
        )}
        <Table.Cell><Link to={`/image/main/${imageData.id}`}>{imageData.filename}</Link></Table.Cell>
        <Table.Cell>{imageData.image_info.width}x{imageData.image_info.height}</Table.Cell>
        <Table.Cell><Filesize bytes={imageData.image_info.size} /></Table.Cell>
        <Table.Cell><DateTime timestamp={imageData.timestamp} /></Table.Cell>
        <Table.Cell>
            <Button.Group size='mini'>
                <Button icon='download' content='download' as='a' href={`/api/images/main/${imageData.id}?format=original&download=true`} />
            </Button.Group>
        </Table.Cell>
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

    togglePreviews = () => this.setState({...this.state, previews: !this.state.previews});

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
                                <Button content='previews' icon='image' toggle active={this.state.previews} onClick={() => this.togglePreviews()}/>
                                <Button content='back' icon='arrow left' onClick={() => this.props.history.goBack() } />
                            </Button.Group>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Header>{images.length} images, <Filesize bytes={images.map(i => this.state.imagesData[i]).reduce( (acc, cur) => cur && acc + cur.image_info.size, 0) } /></Header>
                        <Table stackable striped basic="very" selectable>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell />
                                    {this.state.previews && <Table.HeaderCell>Preview</Table.HeaderCell> }
                                    <Table.HeaderCell>Filename</Table.HeaderCell>
                                    <Table.HeaderCell>Resolution</Table.HeaderCell>
                                    <Table.HeaderCell>Size</Table.HeaderCell>
                                    <Table.HeaderCell>Date</Table.HeaderCell>
                                    <Table.HeaderCell>Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                { images.map( (image, index) => <ImageRow index={index} imageData={this.state.imagesData[image]} previews={this.state.previews} key={image} />)}
                            </Table.Body>
                        </Table>
                    </Grid.Row>
                </Grid>
            </Container>
        )
    }
}

export default withRouter(Images);
