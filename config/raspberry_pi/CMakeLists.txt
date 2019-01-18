configure_file(commands.json.in ${CMAKE_CURRENT_BINARY_DIR}/commands.json)
configure_file(etc_AstroPhotoPlus-commands.json.in ${CMAKE_CURRENT_BINARY_DIR}/etc_AstroPhotoPlus-commands.json)
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


