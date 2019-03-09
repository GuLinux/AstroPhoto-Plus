import React from 'react';
import { Menu, Table, Button, Container, Image, Header, Pagination } from 'semantic-ui-react';
import { Filesize } from '../components/Filesize';
import DateTime from '../components/DateTime';
import { Link } from 'react-router-dom';
import { NavbarSectionMenu } from '../Navigation/NavbarMenu';
import { Routes } from '../routes';


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
                <Button icon='download' content='download' as='a' target='_blank' href={`/api/images/main/${imageData.id}?format=original&download=true`} />
            </Button.Group>
        </Table.Cell>
    </Table.Row>
) : null;

const PAGE_SIZE = 10;

export const ImagesSectionMenu = ({sequence, setImagesPreview, previews}) => (
    <NavbarSectionMenu sectionName='Images'>
        <Menu.Item content='previews' icon='image' onClick={() => setImagesPreview(!previews)} />
        <Menu.Item content='back' icon='arrow left' to={Routes.SEQUENCE_PAGE.format(sequence)} as={Link} />
    </NavbarSectionMenu>
)

export class Images extends React.Component {
    constructor(props) {
        super(props);
        this.state = { imagesData: {}, startIndex: 0 };
    }
    componentDidMount = () => this.getImages();

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
    }

    componentWillUnmount = () => {
        if(this.__getImagesTimeout) {
            clearTimeout(this.__getImagesTimeout);
        }
    }

    getImages = () => {
        if(!this.props.images)
            return;
        this.props.fetchImages( this.props.images, (imagesData) => this.setState({...this.state, imagesData}));
    }

    setPage = (activePage) => {
        const startIndex = (activePage - 1) * PAGE_SIZE;
        this.setState({...this.state, startIndex });
    }

    renderPagination = () => {
        if(this.props.images.length <= PAGE_SIZE) {
            return null;
        }
        const activePage = this.state.startIndex + 1;
        const totalPages = Math.ceil(this.props.images.length / PAGE_SIZE);
        return <Pagination pointing secondary defaultActivePage={activePage} totalPages={totalPages} onPageChange={(e, data) => this.setPage(data.activePage)} />;
    }

    render = () => {
        const { images } = this.props;
        if(!images)
            return null;
        return (
            <Container textAlign='center' >
                <Header>{images.length} images, <Filesize bytes={images.map(i => this.state.imagesData[i]).reduce( (acc, cur) => cur && acc + cur.image_info.size, 0) } /></Header>
                { this.renderPagination() }
                <Table stackable striped basic="very" selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell />
                            {this.props.previews && <Table.HeaderCell>Preview</Table.HeaderCell> }
                            <Table.HeaderCell>Filename</Table.HeaderCell>
                            <Table.HeaderCell>Resolution</Table.HeaderCell>
                            <Table.HeaderCell>Size</Table.HeaderCell>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        { images
                            .filter( (image, index) => index >= this.state.startIndex && index < this.state.startIndex + PAGE_SIZE)
                            .map( (image, index) => <ImageRow index={index + this.state.startIndex} imageData={this.state.imagesData[image]} previews={this.props.previews} key={image} />)
                        }
                    </Table.Body>
                </Table>
                { this.renderPagination() }

            </Container>
        )
    }
}

