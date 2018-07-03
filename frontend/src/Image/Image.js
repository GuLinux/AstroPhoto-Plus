import React from 'react';
import { Image as SemanticImage, Segment, Form, Container, Grid, Header, Button } from 'semantic-ui-react';
import ImageViewOptions from '../Image/ImageViewOptions';


const Image = ({url, options, setOption, history }) => url ? (
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
                <SemanticImage src={url} fluid/>
            </Grid.Column>
        </Grid>
    </Container>
) : null;

export default Image;
