import React from 'react';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { catalogSearchSelector } from './selectors';
import {} from './actions.js';
import { Button, Header, Message, Form, Dropdown, Input } from 'semantic-ui-react';
import { lookupCatalogObject, clearCatalogResults } from './actions';

class CatalogSearchComponent extends React.Component {
    state = {}

    catalogsDropdown = () => <Dropdown options={this.props.catalogs} defaultValue={this.state.catalog} onChange={this.setCatalog} />

    setObjectName = (e, d) => this.setState({objectName: d.value});
    setCatalog = (e, d) => this.setState({catalog: d.value});

    canSearch = () => get(this.state, 'objectName', '') !== '' && get(this.state, 'catalog', '') !== '' && ! get(this.props, 'search.fetching', false);

    render = () => {
        if(this.props.catalogs.length === 0) {
            return (
                <Message>
                    <Message.Header>No catalogs found</Message.Header>
                    <p>
                        It looks like you have no catalogs in your database. Catalogs are required for this feature. You can download catalogs by visiting the settings page.
                    </p>
                </Message>
            );
        }
        return (
            <React.Fragment>
                <Form size='mini'>
                    <Form.Group inline>
                        <Form.Field>
                            <label>Search object</label>
                            <Input
                                type='text'
                                placeholder='Object name or number'
                                labelPosition='right'
                                label={this.catalogsDropdown()}
                                onChange={this.setObjectName}
                                value={get(this.state.objectName, '')}
                            />
                        </Form.Field>
                        <Form.Button icon='search' content='Search' size='tiny' disabled={!this.canSearch()} onClick={this.lookupCatalogObject} />
                    </Form.Group>
                </Form>
                { this.props.search && ! this.props.search.fetching && this.props.search.error && this.renderError() }
                { this.props.search && ! this.props.search.fetching && this.props.search.lookupObject && this.renderLookupObject() }
            </React.Fragment>
        );
    }

    lookupCatalogObject = () => this.props.lookupCatalogObject(this.state.catalog, this.state.objectName, this.props.sectionKey);

    renderError = () => (
        <Message warning>
            <Message.Header>{this.props.search.error.error}</Message.Header>
            <p>
                {this.props.search.error.error_message}
            </p>
        </Message>
    );

    renderLookupObject = () => (
        <div>
            <Header size='small'>Object found</Header>
            {this.renderObject(this.props.search.lookupObject)}
        </div>
    );

    renderObject = (object) => (
        <Button icon='add' onClick={() => this.onObjectSelected(object)} content={object.displayName} circular />
    );

    onObjectSelected = (object) => {
        this.props.onObjectSelected(object);
        if(this.props.clearOnSelected) {
            this.props.clearCatalogResults(this.props.sectionKey);
        }
    }
}

export const CatalogSearch = connect((state, props) => catalogSearchSelector(state, props), {
    lookupCatalogObject,
    clearCatalogResults,
})(CatalogSearchComponent);

