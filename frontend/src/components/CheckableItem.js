import React from 'react'
import { Button, Glyphicon } from 'react-bootstrap';


const CheckableItem = ({name, checked, onChange, children, ...props}) => (
    <Button bsStyle="link" onClick={() => onChange(name)} {...props}>
        <Glyphicon glyph={checked ? 'check' : 'unchecked'} />
        {children}
    </Button>
)

export default CheckableItem


