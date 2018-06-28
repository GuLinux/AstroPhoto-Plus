import React from 'react';
import { Image as SemanticImage, Menu, Checkbox, Input } from 'semantic-ui-react';


const Image = ({url, options, setOption, setNumericOption }) => url ? (
    <React.Fragment>
        <Menu fluid>
            <Menu.Item header>Controls</Menu.Item>
            <Menu.Item>
                <Checkbox label='Auto stretch' toggle size='mini' checked={options.stretch} onChange={(e, data) => setOption({stretch: data.checked})} />
            </Menu.Item>
            { options.stretch ? null : (
                <React.Fragment>
                    <Menu.Item>
                        <Input type='number' label='Clip low' value={options.clipLow} onChange={(e, data) => setNumericOption('clipLow', parseInt(data.value), 0, 100)} size='mini' />
                    </Menu.Item>
                    <Menu.Item>
                        <Input type='number' label='Clip high' value={options.clipHigh} onChange={(e, data) => setNumericOption('clipHigh', parseInt(data.value), 0, 100)} size='mini' />
                    </Menu.Item>
                </React.Fragment>
            )}
        </Menu>
        <SemanticImage src={url} fluid/>
    </React.Fragment>
) : null;

export default Image;
