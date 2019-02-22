import React from 'react';
import { Container, Content, Input, Button, Text, H3 } from 'native-base';
import { Navbar } from '../Navigation/Navbar.native';
export class BackendSelectionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { address: props.address };
    }

    setBackend = () => {
        this.props.saveBackend(this.state.address);
    }

    onBackendChanged = ({ nativeEvent }) => this.setState({...this.state, address: nativeEvent.text});

    render = () => {
        const { navigation } = this.props;
        return (
            <Container>
                <Navbar navigation={navigation} pageName='Backend selection' />
                <Content padder>
                    <H3>Set the address of the backend server</H3>
                    <Input placeholder='Backend server' onChange={this.onBackendChanged} value={this.state.address} />
                    <Button full onPress={this.setBackend} disabled={!this.state.address}>
                        <Text>Set</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}