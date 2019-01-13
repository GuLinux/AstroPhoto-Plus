import React from 'react';
import { NumericInput } from '../components/NumericInput';
import { Form } from 'semantic-ui-react';


export class CameraBinning extends React.Component {
    setBinning = binning => this.props.setOption({binning});
    render = () => {
        const  { selectedBinning, binning } = this.props;
        if(!binning) {
            return null;
        }
        return (
            <React.Fragment>
                <Form.Field>
                    <NumericInput label='Binning' min={binning.min} max={binning.max} step={1} value={selectedBinning} onChange={this.setBinning} />;
                </Form.Field>
            </React.Fragment>
        );
    }
}
