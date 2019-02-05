#!/bin/bash
# Colour codes

RED=31
GREEN=32
YELLOW=33
LIGHT_GREEN=92
LIGHT_YELLOW=93

if [ "$EUID" != 0 ]; then
    cat >&2 <<EOF
This program must be run as root. Please retry using sudo:
  sudo $0 $@
EOF
    exit 1
fi

target_user="${TARGET_USER:-$SUDO_USER}"
workdir="/tmp/setup-astrophotoplus-$$"

rm -rf "$workdir"
mkdir -p "$workdir"

prevdir="$PWD"
cd "$workdir"

notify() {
    text="$1"
    colour="${2:-$LIGHT_GREEN}"
    stars_colour="${3:-$YELLOW}"
    sleep_time="${4:-3}"
    endline="\n"
    if [ "$5" == "noendl" ]; then
        endline=""
    fi

    echo -en "\e[${stars_colour}m*****\e[m  \e[${colour}m${text}\e[m$endline"
    sleep "$sleep_time"
}

install-prerequisites() {
    if ! which wget >/dev/null 2>&1; then
        notify "Installing wget" $LIGHT_GREEN $YELLOW 2
        sudo apt-get install -y -q wget
    fi
}

install-indi() {
    notify "Downloading INDI packages"
    wget -q -nc  https://www.indilib.org/download/raspberry-pi/send/6-raspberry-pi/9-indi-library-for-raspberry-pi.html -O libindi.tar.gz
    tar xzf libindi.tar.gz && rm libindi.tar.gz
    cd libindi*
    notify "Installing INDI packages"
    sudo apt-get install -y -q ./*.deb
    cd .. && rm -rf libindi*
}

get-astrophotoplus-edge() {
    notify "Downloading latest AstroPhoto-Plus release"
    wget -nc "https://astrophotoplus.gulinux.net/development-builds/builds/latest/info.json"
    deb_filename="$(
        python <<EOF
import json
with open('info.json') as j:
    release_info = json.load(j)
print([x for x in  release_info['artifacts'] if x.endswith('Raspbian.deb')][0])
EOF
    )"
    wget -nc "https://astrophotoplus.gulinux.net/development-builds/builds/latest/$deb_filename"
}

install-astrophotoplus() {
    apt-get install -q -y ./AstroPhotoPlus*.deb
    AstroPhotoPlus-ctl autosetup "$target_user"
}

ask-yn() {
    prompt=""
    while [ "$prompt" != y ] && [ "$prompt" != n ]; do
        "$@"
        read -N 1 prompt; echo
    done
    [ "$prompt" == y ]
}

setup-ap() {
    if ask-yn notify "Setup wifi access point connection? [y/n] " $LIGHT_GREEN $YELLOW 0 noendl; then
        read -e -i "AstroPhoto-Plus" -p "Wifi name? " ASTROPHOTOPLUS_AP
        read -e -i "AstroPhoto-Plus" -p "Wifi WPA2 key? " ASTROPHOTOPLUS_AP_PSK
        setup-ap-vars
    fi
}

setup-ap-vars() {
    /usr/share/AstroPhotoPlus/config/raspberry_pi/astrophotoplus-wifi-helper configure-ap "$ASTROPHOTOPLUS_AP" "$ASTROPHOTOPLUS_AP_PSK" >/dev/null
    /usr/share/AstroPhotoPlus/config/raspberry_pi/astrophotoplus-wifi-helper ap-on
}

cleanup() {
    cd "$prevdir"
    rm -rf "$workdir"
}

install-prerequisites
install-indi
get-astrophotoplus-edge
install-astrophotoplus
if [ -n "$ASTROPHOTOPLUS_AP" ] && [ -n "$ASTROPHOTOPLUS_AP_PSK" ]; then
    setup-ap-vars
else
    setup-ap
fi

cleanup

notify "Automatic setup of AstroPhoto Plus finished. You should now be able to run the app at the address http://localhost (or in your local network, at http://$(hostname).local)"

