configure_file(${CMAKE_CURRENT_SOURCE_DIR}/AstroPhotoPlus.service ${CMAKE_CURRENT_BINARY_DIR}/AstroPhotoPlus.service @ONLY)
install(
    DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
    DESTINATION ${ASTRO_PHOTO_PLUS_HOME}/
    PATTERN "*pyc" EXCLUDE
    PATTERN "__pycache__" EXCLUDE
    PATTERN "start-server" EXCLUDE
    PATTERN "access.log" EXCLUDE
    PATTERN "*.json.gz" EXCLUDE
)

INSTALL(
    FILES ${CMAKE_CURRENT_BINARY_DIR}/AstroPhotoPlus.service
    DESTINATION lib/systemd/system/
)
install(PROGRAMS ${CMAKE_CURRENT_SOURCE_DIR}/start-server DESTINATION ${ASTRO_PHOTO_PLUS_HOME}/backend)
install(PROGRAMS ${CMAKE_CURRENT_SOURCE_DIR}/start-debug-server DESTINATION ${ASTRO_PHOTO_PLUS_HOME}/backend)
