import React from 'react';
import { Image, Segment, Form, Container, Grid, Header, Button, Loader } from 'semantic-ui-react';
import ImageViewOptions from '../Image/ImageViewOptions';

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
        this.state = { loading: false }
    }

    toggleLoading = (loading) => this.setState({...this.state, loading});

    onImageLoading = () => {
        this.toggleLoading(true);
        this.props.onImageLoading && this.props.onImageLoading();
    }

    onImageLoaded = () => {
        this.toggleLoading(false);
        this.props.onImageLoaded && this.props.onImageLoaded();
    }


    render = () => (
        <React.Fragment>
            <Loader active={this.state.loading} inverted />
            <ImageComponent {...this.props} onImageLoading={this.onImageLoading} onImageLoaded={this.onImageLoaded} />
        </React.Fragment>
    );
}

const ImagePage  = ({url, options, setOption, history, imageLoading, onImageLoaded}) => url ? (
    <Container fluid>
        <Grid stackable columns={16}>
            <Grid.Column width={4}>
                <Segment>
                    <Form>
                        <Button fluid content='back' primary size='tiny' onClick={() => history.goBack() } />
                        <Header size='tiny' content='View Options' textAlign='center' />
                        <ImageViewOptions options={options} setOption={setOption} />
                    </Form>
                </Segment>
            </Grid.Column>
            <Grid.Column width={12}>
                <ImageLoader uri={url} fitScreen={!!options.fitToScreen} />
            </Grid.Column>
        </Grid>
    </Container>
) : null;

export default ImagePage;
