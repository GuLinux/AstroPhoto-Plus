configure_file(commands.json.in ${CMAKE_CURRENT_BINARY_DIR}/commands.json)
install(FILES ${CMAKE_CURRENT_BINARY_DIR}/commands.json dhcpcd-ap.conf dnsmasq-wlan0.conf hostapd hostapd.conf DESTINATION share/StarQuew/config/raspberry_pi)
install(PROGRAMS starquew-wifi-helper DESTINATION share/StarQuew/config/raspberry_pi)
configure_file(etc_StarQuew-commands.json.in ${CMAKE_CURRENT_BINARY_DIR}/etc_StarQuew-commands.json)


