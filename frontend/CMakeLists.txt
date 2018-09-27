find_program(NPM npm)
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
    npm-dependencies
    COMMAND npm i
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
)

add_custom_target(
    frontend-bundle ALL
    COMMAND npm run build
    DEPENDS npm-dependencies
)

install(
    DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}/build/
    DESTINATION ${STARQUEW_HOME}/frontend
)

install(
    DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}/webserver-conf
    DESTINATION ${STARQUEW_HOME}/frontend
)
