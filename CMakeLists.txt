cmake_minimum_required(VERSION 3.0)
include(project_version.cmake)
project(AstroPhotoPlus LANGUAGES NONE VERSION ${ASTRO_PHOTO_PLUS_PROJECT_VERSION})

set(ASTRO_PHOTO_PLUS_HOME lib/${CMAKE_PROJECT_NAME})
set(ASTRO_PHOTO_PLUS_INSTALL_PREFIX ${CMAKE_INSTALL_PREFIX}/${ASTRO_PHOTO_PLUS_HOME})
set(CONFDIR ${CMAKE_INSTALL_PREFIX}/etc CACHE STRING "Directory for system wide configuration files")
set(VERSION_SUFFIX "" CACHE STRING "Suffix to append to version number")

configure_file(${CMAKE_SOURCE_DIR}/scripts/AstroPhotoPlus-ctl ${CMAKE_BINARY_DIR}/scripts/AstroPhotoPlus-ctl @ONLY)
configure_file(${CMAKE_SOURCE_DIR}/scripts/version.sh.in ${CMAKE_BINARY_DIR}/version.sh)

set(ENV{SKIP_CMAKE} 1) 
message("Setting build version: ${PROJECT_VERSION_MAJOR} ${PROJECT_VERSION_MINOR} ${PROJECT_VERSION_PATCH}${VERSION_SUFFIX}")
execute_process(
    COMMAND python3 ./scripts/set_version.py ${PROJECT_VERSION_MAJOR} ${PROJECT_VERSION_MINOR} ${PROJECT_VERSION_PATCH}${VERSION_SUFFIX}
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
)


add_subdirectory(config)
add_subdirectory(frontend)
add_subdirectory(backend)

install(PROGRAMS ${CMAKE_CURRENT_BINARY_DIR}/scripts/AstroPhotoPlus-ctl DESTINATION bin)
install(FILES ${CMAKE_SOURCE_DIR}/LICENSE DESTINATION share/AstroPhotoPlus)
install(FILES ${CMAKE_SOURCE_DIR}/README.md DESTINATION share/AstroPhotoPlus)


SET(CPACK_PACKAGE_DIRECTORY ${CMAKE_BINARY_DIR}/packages)
SET(CPACK_PACKAGE_VERSION_MAJOR ${PROJECT_VERSION_MAJOR})
SET(CPACK_PACKAGE_VERSION_MINOR ${PROJECT_VERSION_MINOR})
SET(CPACK_PACKAGE_VERSION_PATCH ${PROJECT_VERSION_PATCH}${VERSION_SUFFIX})
SET(CPACK_RESOURCE_FILE_LICENSE ${CMAKE_SOURCE_DIR}/LICENSE)
SET(CPACK_DEBIAN_PACKAGE_MAINTAINER "Marco Gulino <marco.gulino@gmail.com>")
SET(CPACK_DEBIAN_FILE_NAME "AstroPhotoPlus-${CPACK_PACKAGE_VERSION_MAJOR}.${CPACK_PACKAGE_VERSION_MINOR}.${CPACK_PACKAGE_VERSION_PATCH}-Ubuntu_Debian.deb")

## Debian package dependencies
# System dependencies
set(CPACK_DEBIAN_PACKAGE_DEPENDS "nginx | apache2, python3, swig, build-essential, redis-server, astrometry.net, network-manager")
set(CPACK_DEBIAN_PACKAGE_DEPENDS "${CPACK_DEBIAN_PACKAGE_DEPENDS}, python3-pip, python3-venv, python3-astropy, python3-numpy, python3-pkgconfig, python3-pil, python3-astroquery, python3-redis, python3-healpy, python3-flask, python3-requests, python3-six, python3-svgwrite, python3-networkmanager, python3-psutil")

# Other libraries
set(CPACK_DEBIAN_PACKAGE_DEPENDS "${CPACK_DEBIAN_PACKAGE_DEPENDS}, libatlas-base-dev, libpython3-dev, libindi-dev, zlib1g-dev, libnova-dev, libcfitsio-dev, libopenjp2-7, libopencv-dev, libccfits-dev, libffi-dev")
set(CPACK_DEBIAN_PACKAGE_CONFLICTS "openresolv, dhcpcd5, dnsmasq")


set(CPACK_DEBIAN_PACKAGE_ARCHITECTURE all)

SET(CPACK_GENERATOR "TGZ;DEB")

include(CPack)
