export const imageUrlBuilder = (cameraId, id, format='png', maxWidth=0, stretch=0) =>
    `/api/cameras/${cameraId}/image/${id}?maxwidth=${maxWidth}&stretch=${stretch ? 1 : 0}&format=${format}`;
