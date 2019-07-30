find_program(YARN yarn)
file(
    COPY ${CMAKE_CURRENT_SOURCE_DIR}
    DESTINATION ${CMAKE_BINARY_DIR}
    PATTERN node_modules EXCLUDE
    PATTERN build EXCLUDE
    PATTERN webserver-conf/nginx/* EXCLUDE
)

set(FRONTEND_ROOTDIR ${ASTRO_PHOTO_PLUS_INSTALL_PREFIX}/frontend)
configure_file(${CMAKE_SOURCE_DIR}/config/prod-webserver-conf/nginx/astrophotoplus.conf ${CMAKE_CURRENT_BINARY_DIR}/webserver-conf/nginx/astrophotoplus.conf)
configure_file(${CMAKE_SOURCE_DIR}/config/prod-webserver-conf/apache2/astrophotoplus.conf ${CMAKE_CURRENT_BINARY_DIR}/webserver-conf/apache2/astrophotoplus.conf)

add_custom_target(
    yarn-dependencies
    COMMAND yarn install
)

add_custom_target(
    remove_googleapis
    COMMAND bash ${CMAKE_SOURCE_DIR}/scripts/remove_googlefonts_call
)

add_custom_target(
    frontend-bundle ALL
    COMMAND yarn run build
    DEPENDS yarn-dependencies remove_googleapis
)

install(
    DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}/build/
    DESTINATION ${ASTRO_PHOTO_PLUS_HOME}/frontend
)

install(
    DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}/webserver-conf
    DESTINATION ${ASTRO_PHOTO_PLUS_HOME}/frontend
)
