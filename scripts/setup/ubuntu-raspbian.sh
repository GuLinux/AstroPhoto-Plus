#!/bin/bash
#stage1  Colour codes

RED=31
GREEN=32
YELLOW=33
LIGHT_GREEN=92
LIGHT_YELLOW=93

DISTRO_VARIANT=$( lsb_release -si)

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
    [ "$UNATTENDED_SETUP" == y ] && sleep "$sleep_time"
}

install-prerequisites() {
    sudo apt-get update -q -y
    if ! which wget >/dev/null 2>&1; then
        notify "Installing wget" $LIGHT_GREEN $YELLOW 2
        sudo apt-get install -y -q wget
    fi
    if ! which python3 >/dev/null 2>&1; then
        notify "Installing python3" $LIGHT_GREEN $YELLOW 2
        sudo apt-get install -y -q python3
    fi
    if ! which lsb_release >/dev/null 2>&1; then
        sudo apt-get install -y -q lsb-release
    fi
}

setup-indi-ppa() {
    case "$DISTRO_VARIANT" in
        Raspbian)
            notify "Adding INDI repository"
            wget -O - https://www.astroberry.io/repo/key | apt-key add -
            echo 'deb https://www.astroberry.io/repo/ buster main' > /etc/apt/sources.list.d/astroberry.list
            apt-get update
            notify "Installing INDI packages"
            apt-get install -y indi-full gsc
            ;;
        Ubuntu)
            notify "Adding INDI stable PPA"
            add-apt-repository -y ppa:mutlaqja/ppa
            apt update
            notify "Installing INDI full"
            apt-get install -y -q indi-full
            ;;
        *)
            echo "Your distribution $DISTRO_VARIANT is not yet supported for automatic setup. You can still install AstroPhoto Plus manually"
            exit 1
            ;;
    esac

}

setup-phd2() {
    if ask-yn echo -n "Do you want to setup VNC server and PHD2 Autoguider? [y/n] "; then
        if [ "$DISTRO_VARIANT" == 'Ubuntu' ]; then
            notify "Adding PHD2 PPA"
            add-apt-repository -y ppa:pch/phd2
            apt update
        fi
        apt-get install -y -q phd2 tigervnc-standalone-server
    fi
}

get-astrophotoplus-edge() {
    if [ -n "$ASTROPHOTOPLUS_RELEASE_DOWNLOAD_OPTS" ]; then
        wget -nc $ASTROPHOTOPLUS_RELEASE_DOWNLOAD_OPTS
    else
        notify "Downloading latest AstroPhoto-Plus release"
        wget -nc "https://astrophotoplus.gulinux.net/releases" -O info.json
        python3 <<EOF
import json
import os

with open('info.json') as j:
    release_info = json.load(j)
last_release = sorted(release_info, key=lambda r: r['created_at'], reverse=True)[0]
asset = [x for x in  last_release['assets'] if x['name'].endswith('.deb')][0]
os.system(' '.join(['wget', '-nc', asset['browser_download_url'], '-O', asset['name']]))
EOF
    fi
}

install-astrophotoplus() {
    apt-get install -q -y ./AstroPhotoPlus*.deb
    AstroPhotoPlus-ctl autosetup "$target_user"
}

ask-yn() {
    if [ "$UNATTENDED_SETUP" == "y" ]; then
        return 0
    fi
    prompt=""
    while [ "$prompt" != y ] && [ "$prompt" != n ]; do
        "$@"
        read -N 1 prompt; echo
    done
    [ "$prompt" == y ]
}

setup-sudo() {
    notify "Do you want to allow the user $target_user to run sudo without password?" $LIGHT_GREEN $YELLOW 0
    notify "Warning! Although this is perfectly safe in isolated environments, it might be a security risk in some environments. It might be a good idea to allow this if you want to trigger privileged commands (reboot, wifi management, automatic updates) from AstroPhoto Plus. So unless you have strong security concerns, this is highly recommended." $RED $YELLOW 0
    if ask-yn echo -n "Setup sudo? [y/n] "; then
        echo "$target_user    ALL = NOPASSWD: ALL" >/etc/sudoers.d/${target_user}_nopasswd
        chmod 644 /etc/sudoers.d/${target_user}_nopasswd
    fi
}

cleanup() {
    cd "$prevdir"
    rm -rf "$workdir"
}

setup-sudo
install-prerequisites
setup-indi-ppa
setup-phd2
get-astrophotoplus-edge
install-astrophotoplus

cleanup

notify "Automatic setup of AstroPhoto Plus finished. You should now be able to run the app at the address http://localhost (or in your local network, at http://$(hostname).local)"

