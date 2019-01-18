set(RASPBIAN_SHARE_DIR ${CMAKE_INSTALL_PREFIX}/share/AstroPhotoPlus/config/raspberry_pi)


configure_file(commands.json.in ${CMAKE_CURRENT_BINARY_DIR}/commands.json)
configure_file(etc_AstroPhotoPlus-commands.json.in ${CMAKE_CURRENT_BINARY_DIR}/etc_AstroPhotoPlus-commands.json)
configure_file(postinst.in ${CMAKE_CURRENT_BINARY_DIR}/postinst @ONLY)
configure_file(postrm.in ${CMAKE_CURRENT_BINARY_DIR}/postrm @ONLY)

set(
    RASPBIAN_SOURCES
    ${CMAKE_CURRENT_BINARY_DIR}/commands.json
    ${CMAKE_CURRENT_BINARY_DIR}/etc_AstroPhotoPlus-commands.json
    dhcpcd-ap.conf
    dnsmasq-wlan0.conf
    hostapd
    hostapd.conf
)
install(FILES ${RASPBIAN_SOURCES} DESTINATION share/AstroPhotoPlus/config/raspberry_pi)
install(PROGRAMS astrophotoplus-wifi-helper DESTINATION share/AstroPhotoPlus/config/raspberry_pi)

if("${PACKAGE_TARGET}" STREQUAL "raspbian")
    set(CPACK_DEBIAN_PACKAGE_CONTROL_EXTRA "${CMAKE_CURRENT_BINARY_DIR}/postinst;${CMAKE_CURRENT_BINARY_DIR}/postrm" CACHE INTERNAL "debian scripts")
endif()
