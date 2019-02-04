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

target_user="$SUDO_USER"
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

    echo -e "\e[${stars_colour}m*****\e[m  \e[${colour}m${text}\e[m"
    sleep "$sleep_time"
}

install-prerequisites() {
    if ! which wget >/dev/null 2>&1; then
        notify "Installing wget" $LIGHT_GREEN $YELLOW 2
        sudo apt-get install -y -q wget
    fi
}

setup-indi-ppa() {
    notify "Adding INDI stable PPA"
    add-apt-repository -y ppa:mutlaqja/ppa
    notify "Installing INDI full"
    apt-get install -y -q indi-full
}

get-astrophotoplus-edge() {
    notify "Downloading latest AstroPhoto-Plus release"
    wget -nc "https://gulinux.net/downloads/AstroPhotoPlus/latest/info.json"
    deb_filename="$(
        python <<EOF
import json
with open('info.json') as j:
    release_info = json.load(j)
print([x for x in  release_info['artifacts'] if x.endswith('Linux.deb')][0])
EOF
    )"
    wget -nc "https://gulinux.net/downloads/AstroPhotoPlus/latest/$deb_filename"
}

install-astrophotoplus() {
    apt install -q -y ./AstroPhotoPlus*.deb
    AstroPhotoPlus-ctl autosetup "$target_user"
}

setup-nm-ap() {
    notify "Setup wifi access point connection? [y/n]"
    read -N 1 prompt; echo
    if [ prompt == 'y' ]; then
        read -e -i "AstroPhoto-Plus" -p "Wifi name? " essid
        read -e -i "AstroPhoto-Plus password" -p "Wifi WPA2 key? " psk
        read -N 1 -p "Autoconnect on startup? [y/n]" autoconnect
        if [ "$autoconnect" ] == "y"; then
            autoconnect=yes
        else
            autoconnect=no
        fi
        sudo nmcli connection add type wifi ifname "*" autoconnect "$autoconnect" save yes con-name "$essid"  mode ap ssid "$essid" wifi-sec.key-mgmt wpa-psk wifi-sec.psk "$psk" ipv4.method shared
    fi
}

setup-sudo() {
    notify "Setup the user $target_user to run sudo without password? [y/n]"
    notify "Warning! Although this is perfectly safe in isolated environments, it might be a security concern. It might be a good idea to allow this if you want to trigger privileged commands from AstroPhoto Plus." $RED
    read -N 1 prompt; echo
    if [ "$prompt" == "y" ]; then
        echo "$target_user    ALL = NOPASSWD: ALL" >/etc/sudoers.d/${target_user}_nopasswd
        chmod 644 /etc/sudoers.d/${target_user}_nopasswd
    fi
}

cleanup() {
    cd "$prevdir"
    rm -rf "$workdir"
}

setup-indi-ppa
get-astrophotoplus-edge
install-astrophotoplus
setup-sudo
setup-nm-ap
cleanup

