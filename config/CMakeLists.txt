set(ETC_COMMANDS_FILE ${CONFDIR}/AstroPhotoPlus-commands.json)

add_subdirectory(linux_generic)
add_subdirectory(debian_based)
install(DIRECTORY dev-webserver-conf prod-webserver-conf DESTINATION share/AstroPhotoPlus/config)

