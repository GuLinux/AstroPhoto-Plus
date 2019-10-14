add_subdirectory(resources)
set(ASTROPHOTOPLUS_SOURCES
   main.cpp
   mainwindow.cpp
   mainwindow.ui
   serverdiscovery.cpp
   customwebpage.cpp
   api.cpp
   astrophotopluswidget.cpp
   notifications.cpp
   settings.cpp
   notification.ui
   ${ASTROPHOTOPLUS_RESOURCES}
)
   
add_executable(${PROJECT_NAME} ${ASTROPHOTOPLUS_SOURCES})

# Add the Qt5 Widgets for linking
target_link_libraries(${PROJECT_NAME} Qt5::Widgets Qt5::WebEngineWidgets Qt5::Multimedia)
install(TARGETS ${PROJECT_NAME} RUNTIME DESTINATION bin)
