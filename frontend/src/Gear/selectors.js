import { getDevices, getValueInputSelector, getPropertyInputSelector } from '../INDI-Server/selectors';
import { createSelector } from 'reselect'
import { transform } from 'lodash';
import { getPropertyId } from '../INDI-Server/utils';

const filterConnectedDevices = (devices, predicate) => devices.ids.filter(
    id => {
        const device = devices.entities[id];
        return device.connected && predicate(device);
    }
);

export const getConnectedCameras = createSelector([getDevices], (devices) => filterConnectedDevices(devices, d => d.interfaces.includes('ccd')));
export const getConnectedTelescopes = createSelector([getDevices], (devices) => filterConnectedDevices(devices, d => d.interfaces.includes('telescope')));
export const getConnectedFilterWheels = createSelector([getDevices], (devices) => filterConnectedDevices(devices, d => d.interfaces.includes('filter')));

export const filterDevices = (devices, ids) => ({
    ids,
    entities: transform(ids, (result, id) => result[id] = devices.entities[id], {}),
    length: ids.length,
});

export const getCameraExposureValue = (state, {cameraId}) => getValueInputSelector(cameraId, 'CCD_EXPOSURE', 'CCD_EXPOSURE_VALUE')(state);
export const getCameraExposureProperty = (state, {cameraId}) => getPropertyInputSelector(state, {propertyId: getPropertyId(cameraId, 'CCD_EXPOSURE')});

export const getCameraBinningValue = (state, {cameraId}) => getValueInputSelector(cameraId, 'CCD_BINNING', 'HOR_BIN')(state);

export const getFilterWheelCurrentFilter = (state, {filterWheelId}) =>
    getValueInputSelector(filterWheelId, 'FILTER_SLOT', 'FILTER_SLOT_VALUE')(state);

export const getFilterWheelAvailableFiltersProperty = (state, {filterWheelId}) =>
    getPropertyInputSelector(state, {propertyId: getPropertyId(filterWheelId, 'FILTER_NAME')});

export const getFilterWheelFilterName = (state, {filterWheelId, filterNumber}) => 
    getValueInputSelector(filterWheelId, 'FILTER_NAME', `FILTER_SLOT_NAME_${filterNumber}`)(state);

export const getFilterWheelCurrentFilterName = (state, {filterWheelId}) => {
    const currentFilterNumber = getFilterWheelCurrentFilter(state, {filterWheelId});
    return currentFilterNumber ? getFilterWheelFilterName(state, {filterWheelId, filterNumber: currentFilterNumber.value}) : null;
}

export const getCCDWidthPix = (state, {cameraId}) => getValueInputSelector(cameraId, 'CCD_INFO', 'CCD_MAX_X')(state);
export const getCCDPixelPitch = (state, {cameraId}) => getValueInputSelector(cameraId, 'CCD_INFO', 'CCD_PIXEL_SIZE_X')(state);
export const getTelescopeFocalLength = (state, {telescopeId}) => getValueInputSelector(telescopeId, 'TELESCOPE_INFO', 'TELESCOPE_FOCAL_LENGTH')(state);
