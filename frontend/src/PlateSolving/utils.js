export const getSensorSizeFromResolution = (resolution, pixelSize) => (resolution * pixelSize) / 1000;
export const getFieldOfView = (telescopeFocalLength, sensorSize) => 60 * 2 * Math.atan(sensorSize/ (2 * telescopeFocalLength) ) / (Math.PI / 180);

