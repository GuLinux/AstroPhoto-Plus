import React from 'react';
import { Divider, Menu, Message, Image, Segment, Form, Container, Grid, Header, Button, Loader } from 'semantic-ui-react';
import ImageViewOptions from '../Image/ImageViewOptions';
import fetch from 'isomorphic-fetch'
import { NavbarSectionMenu } from '../Navigation/NavbarMenu';
import { Link } from 'react-router-dom';

export class ImageComponent extends React.Component {
    componentDidUpdate = (prevProps) => this.props.uri !== prevProps.uri && this.props.onImageLoading && this.props.onImageLoading();
    componentDidMount = () => this.props.onImageLoading && this.props.onImageLoading();
    
    render = () => {
        const {uri, fitScreen, onImageLoaded} = this.props;
        let imgProps = onImageLoaded ? { onLoad: onImageLoaded, onError: onImageLoaded } : {};
        return <Image
            alt=''
            src={uri}
            {...imgProps}
            fluid={fitScreen}
            ui={fitScreen}
        />;
    }
}

export class ImageLoader extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: false, ready: false, error: false }
        this.exiting = false;
    }

    toggleLoading = (loading) => this.setState({...this.state, loading});
    toggleReady = (ready) => this.setState({...this.state, ready});

    onImageLoading = () => {
        this.toggleLoading(true);
        this.props.onImageLoading && this.props.onImageLoading();
    }

    onImageLoaded = () => {
        this.toggleLoading(false);
        this.props.onImageLoaded && this.props.onImageLoaded();
    }

    shouldShowLoader = () => (this.state.loading || ! this.state.ready) && ! this.state.error 
    shouldShowImage = () => this.state.ready && ! this.state.error 

    componentDidMount = () => {
        fetch(`/api/images/${this.props.type}/${this.props.id}/wait_until_ready`).then( (response) => {
            if(response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        })
            .then(json => {
                this.exiting || this.toggleReady(true);
            })
            .catch(response => {
                this.exiting || this.setState({...this.state, error: true});
            })
    }

    render = () => this.exiting ? null : (
        <React.Fragment>
            <Loader active={this.shouldShowLoader()} inverted />
            { this.state.error &&   <Message icon='image' header='Error loading image' content='An error occured while loading the image. Please retry, or check your server logs.' /> }
            { this.shouldShowImage() && <ImageComponent {...this.props} onImageLoading={this.onImageLoading} onImageLoaded={this.onImageLoaded} /> }
        </React.Fragment>
    );

    componentWillUnmount = () => this.exiting = true;
}

export const ImageSectionMenu = ({url, id, options, setOption, history, imageLoading, onImageLoaded}) => url && (
    <NavbarSectionMenu sectionName='Image'>
        <Form>
            <Header size='tiny' content='View Options' textAlign='center' />
            <ImageViewOptions options={options} setOption={setOption} />
        </Form>
        <Divider />
        <Menu.Item onClick={() => history.goBack() } content='back' icon='arrow left' />
    </NavbarSectionMenu>
);

export const ImagePage  = ({id, type, url, options }) => url ? (
    <Container fluid>
        <ImageLoader id={id} type={type} uri={url} fitScreen={!!options.fitToScreen} />
    </Container>
) : null;

