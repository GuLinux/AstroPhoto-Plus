export const Routes = {
    ROOT: '/',
    SEQUENCES_PAGE: '/sequences',
    PHD2: '/phd2',
    SEQUENCES_LIST: '/sequences/all',
    INDI_PAGE: '/indi',
    CAMERA_PAGE: '/camera',
    PLATE_SOLVING_PAGE: '/plate-solving',
    SETTINGS_PAGE: '/settings',
    IMAGE_PAGE: '/image/:type/:id',
    SEQUENCE_PAGE: {
        route: '/sequences/:id',
        format: id => `/sequences/${id}`,
    },
    SEQUENCE_JOB_PAGE: '/sequences/:id/items/:itemId',
    SEQUENCE_JOB_IMAGES: '/sequences/:id/items/:itemId/images',
}
