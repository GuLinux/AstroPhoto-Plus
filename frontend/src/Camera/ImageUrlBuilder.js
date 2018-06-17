export const imageUrlBuilder = (cameraId, id, options) =>
    `/api/cameras/${cameraId}/image/${id}?maxwidth=${options.maxWidth || 0}&stretch=${options.stretch ? 1 : 0}&format=${options.format || 'png'}&clip_low=${options.clipLow}&clip_high=${options.clipHigh}`;
