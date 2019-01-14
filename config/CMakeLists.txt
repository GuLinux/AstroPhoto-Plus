add_subdirectory(debian_based)
add_subdirectory(raspberry_pi)

install(DIRECTORY dev-webserver-conf prod-webserver-conf DESTINATION share/AstroPhotoPlus/config)

