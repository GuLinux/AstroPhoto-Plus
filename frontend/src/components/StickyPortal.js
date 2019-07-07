import React from 'react';
import ReactDOM from 'react-dom';

export const StickyPortal = ({children}) => ReactDOM.createPortal(children, document.getElementById('sticky-portal'));


