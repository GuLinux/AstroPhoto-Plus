set(ASTROPHOTOPLUS_RESOURCES ${CMAKE_CURRENT_SOURCE_DIR}/resources.qrc CACHE INTERNAL "")
foreach(res 16 32 48 64 72 96 256 512)
    execute_process(COMMAND ${CMAKE_COMMAND} -E copy_if_different ${CMAKE_SOURCE_DIR}/../frontend/public/icon-${res}.png ${CMAKE_CURRENT_SOURCE_DIR}/app-icon/appicon-${res}.png) 
    install(FILES ${CMAKE_CURRENT_SOURCE_DIR}/app-icon/appicon-${res}.png DESTINATION share/icons/hicolor/${res}x${res}/apps RENAME ${PROJECT_NAME}.png)
endforeach()
configure_file(${CMAKE_CURRENT_SOURCE_DIR}/launcher.desktop ${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}.desktop)
install(FILES ${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}.desktop DESTINATION share/applications)

