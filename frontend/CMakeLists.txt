find_program(YARN yarn)
file(
    COPY ${CMAKE_CURRENT_SOURCE_DIR}
    DESTINATION ${CMAKE_BINARY_DIR}
    PATTERN node_modules EXCLUDE
    PATTERN build EXCLUDE
    PATTERN webserver-conf/nginx/* EXCLUDE
)

set(FRONTEND_ROOTDIR ${STARQUEW_INSTALL_PREFIX}/frontend)
configure_file(${CMAKE_SOURCE_DIR}/config/prod-webserver-conf/nginx/starquew.conf ${CMAKE_CURRENT_BINARY_DIR}/webserver-conf/nginx/starquew.conf)
configure_file(${CMAKE_SOURCE_DIR}/config/prod-webserver-conf/apache2/starquew.conf ${CMAKE_CURRENT_BINARY_DIR}/webserver-conf/apache2/starquew.conf)

add_custom_target(
    yarn-dependencies
    COMMAND yarn install
)

add_custom_target(
    frontend-bundle ALL
    COMMAND yarn run build
    DEPENDS yarn-dependencies
)

install(
    DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}/build/
    DESTINATION ${STARQUEW_HOME}/frontend
)

install(
    DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}/webserver-conf
    DESTINATION ${STARQUEW_HOME}/frontend
)
