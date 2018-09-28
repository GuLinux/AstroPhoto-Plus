set(ETC_CONFFILE ${CONFDIR}/StarQuew-commands.json)
set(DEBIAN_CONFFILE ${CMAKE_INSTALL_PREFIX}/share/StarQuew/config/debian_based/etc_StarQuew-commands.json)
set(RASPBIAN_CONFFILE ${CMAKE_INSTALL_PREFIX}/share/StarQuew/config/raspberry_pi/etc_StarQuew-commands.json)
configure_file(commands.json.in ${CMAKE_CURRENT_BINARY_DIR}/commands.json)
configure_file(etc_StarQuew-commands.json.in ${CMAKE_CURRENT_BINARY_DIR}/etc_StarQuew-commands.json)
configure_file(postinst.in ${CMAKE_CURRENT_BINARY_DIR}/postinst @ONLY)
configure_file(postrm.in ${CMAKE_CURRENT_BINARY_DIR}/postrm @ONLY)
install(FILES ${CMAKE_CURRENT_BINARY_DIR}/commands.json ${CMAKE_CURRENT_BINARY_DIR}/etc_StarQuew-commands.json DESTINATION share/StarQuew/config/debian_based)
install(PROGRAMS starquew-deb-updater DESTINATION share/StarQuew/config/debian_based)

set(CPACK_DEBIAN_PACKAGE_CONTROL_EXTRA "${CMAKE_CURRENT_BINARY_DIR}/postinst;${CMAKE_CURRENT_BINARY_DIR}/postrm" CACHE INTERNAL "debian scripts")

