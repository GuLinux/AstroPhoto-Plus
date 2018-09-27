install(DIRECTORY debian_based dev-webserver-conf prod-webserver-conf raspberry_pi DESTINATION share/StarQuew/config)
install(PROGRAMS debian_based/starquew-deb-updater DESTINATION share/StarQuew/config/debian_based)
install(PROGRAMS raspberry_pi/starquew-wifi-helper DESTINATION share/StarQuew/config/raspberry_pi)


