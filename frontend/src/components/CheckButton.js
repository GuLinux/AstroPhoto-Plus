import React from 'react';
import { Button } from 'semantic-ui-react';

export const CheckButton = ({active, ...props}) => <Button toggle active={active} icon={active && 'check'} {...props} />