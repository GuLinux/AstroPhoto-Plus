set(ASTROPHOTOPLUS_SOURCES main.cpp mainwindow.cpp mainwindow.ui serverdiscovery.cpp customwebpage.cpp api.cpp resources.qrc)
add_executable(${PROJECT_NAME} ${ASTROPHOTOPLUS_SOURCES})

# Add the Qt5 Widgets for linking
target_link_libraries(${PROJECT_NAME} Qt5::Widgets Qt5::WebEngineWidgets)
