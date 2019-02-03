#!/bin/bash

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

cd "$workdir"

# prerequisite
apt-get install -y curl

setup-indi-ppa() {
    echo "Adding INDI stable PPA"
    add-apt-repository -y ppa:mutlaqja/ppa
    echo "Installing INDI full"
    apt-get install -y indi-full
}

get-astrophotoplus-edge() {
    echo "Downloading latest AstroPhoto-Plus release"
    curl -O "https://gulinux.net/downloads/AstroPhotoPlus/latest/info.json"
    deb_filename="$(
        python <<EOF
import json
with open('info.json') as j:
    release_info = json.load(j)
print([x for x in  release_info['artifacts'] if x.endswith('Linux.deb')][0])
EOF
    )"
    curl -O  "https://gulinux.net/downloads/AstroPhotoPlus/latest/$deb_filename"
}

install-astrophotoplus() {
    apt install -y ./AstroPhotoPlus*.deb
    AstroPhotoPlus-ctl autosetup "$target_user"
}

setup-indi-ppa
get-astrophotoplus-edge
install-astrophotoplus


