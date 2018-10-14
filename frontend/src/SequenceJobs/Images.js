import React from 'react';
import { Table, Button, Container, Image, Header } from 'semantic-ui-react';
import Filesize from '../components/Filesize';
import DateTime from '../components/DateTime';
import { Link, withRouter } from 'react-router-dom';

const ImageRow = ({index, imageData, previews}) => imageData ? (
    <Table.Row>
        <Table.Cell>{index+1}</Table.Cell>
        {previews && (
            <Table.Cell>
                <Image src={`/api/images/main/${imageData.id}?format=jpeg&maxwidth=128&stretch=1`} />
            </Table.Cell>
        )}
        <Table.Cell><Link to={`/image/main/${imageData.id}`}>{imageData.filename}</Link></Table.Cell>
        <Table.Cell>{imageData.image_info.width}x{imageData.image_info.height}</Table.Cell>
        <Table.Cell><Filesize bytes={imageData.image_info.size} /></Table.Cell>
        <Table.Cell><DateTime timestamp={imageData.timestamp} /></Table.Cell>
        <Table.Cell>
            <Button.Group size='mini'>
                <Button icon='image' content='view' as={Link} to={`/image/main/${imageData.id}`} />
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

    updateMenu = () => this.props.onMount({
        section: 'Images',
        navItems: [
            { content: 'previews', icon: 'image', active: this.state.previews, onClick: () => this.togglePreviews(), },
            { content: 'back', icon: 'arrow left', to: `/sequences/${this.props.sequence}`, as: Link }
        ],
    });


    componentDidMount = () => {
        this.getImages();
        this.updateMenu();
    }

    componentDidUpdate = (prevProps) => {
        if(prevProps.images !== this.props.images) {
            if(this.__getImagesTimeout) {
                return;
            }
            this.__getImagesTimeout = setTimeout( () => {
                this.__getImagesTimeout = null;

                this.getImages();
            }, 1000);

        }
        this.updateMenu();
    }

    componentWillUnmount = () => {
        if(this.__getImagesTimeout) {
            clearTimeout(this.__getImagesTimeout);
        }
        this.props.onUnmount();
    }

    getImages = () => {
        if(!this.props.images)
            return;
        this.props.fetchImages( this.props.images, (imagesData) => this.setState({...this.state, imagesData}));
    }

    togglePreviews = () => this.setState({...this.state, previews: !this.state.previews});

    render = () => {
        const { images } = this.props;
        if(!images)
            return null;
        return (
            <Container>
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
            </Container>
        )
    }
}

export default withRouter(Images);
