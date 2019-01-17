configure_file(commands.json.in ${CMAKE_CURRENT_BINARY_DIR}/commands.json)
install(FILES ${CMAKE_CURRENT_BINARY_DIR}/commands.json dhcpcd-ap.conf dnsmasq-wlan0.conf hostapd hostapd.conf DESTINATION share/AstroPhotoPlus/config/raspberry_pi)
install(PROGRAMS astrophotoplus-wifi-helper DESTINATION share/AstroPhotoPlus/config/raspberry_pi)
configure_file(etc_AstroPhotoPlus-commands.json.in ${CMAKE_CURRENT_BINARY_DIR}/etc_AstroPhotoPlus-commands.json)


