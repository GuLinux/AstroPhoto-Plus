import React from 'react';
import { Dropdown } from 'semantic-ui-react';

export const FilterSelection = ({filterName, filterNumber, onClick}) => <Dropdown.Item onClick={onClick} text={filterName} value={filterNumber} />;