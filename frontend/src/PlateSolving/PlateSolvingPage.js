import React from 'react';
import { NotFoundPage } from '../components/NotFoundPage';

export const PlateSolvingPage = ({astrometryDrivers, astrometryDriverEntities}) => {
    if(astrometryDrivers.length === 0)
        return <NotFoundPage
            backToUrl='/indi/server'
            title='No Astrometry driver found'
            message='Astrometry drivers not found. Please double check that your INDI server is connected, with at least one connected astrometry device.'
            backButtonText='INDI server page'
        />;
    return null;
}