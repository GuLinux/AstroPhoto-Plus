configure_file(${CMAKE_CURRENT_SOURCE_DIR}/StarQuew.service ${CMAKE_CURRENT_BINARY_DIR}/StarQuew.service @ONLY)
install(
    DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
    DESTINATION ${STARQUEW_HOME}/
    PATTERN "*pyc" EXCLUDE
    PATTERN "__pycache__" EXCLUDE
    PATTERN "start-server" EXCLUDE
)

INSTALL(
    FILES ${CMAKE_CURRENT_BINARY_DIR}/StarQuew.service
    DESTINATION lib/systemd/system/
)
install(PROGRAMS ${CMAKE_CURRENT_SOURCE_DIR}/start-server DESTINATION ${STARQUEW_HOME}/backend)
