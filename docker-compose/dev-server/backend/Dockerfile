FROM ubuntu:bionic
VOLUME /app

ENV PYINDI_CLIENT_VERSION=0.2.2

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y swig build-essential libnova-dev  python3 python3-pip python3-venv dirmngr swig build-essential libnova-dev libcfitsio-dev zlib1g-dev curl libopencv-dev libccfits-dev
COPY indi-ppa.list /etc/apt/sources.list.d/
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 3F33A288 && apt-get update && apt-get install -y libindi-dev astrometry.net
RUN curl -o pyindi-client-$PYINDI_CLIENT_VERSION.tar.gz "https://files.pythonhosted.org/packages/3d/2c/66e96ab58e2cb5137986c53d8747edc8fb3001340120c62a4dab998f0a2b/pyindi-client-${PYINDI_CLIENT_VERSION}.tar.gz" && tar xzf pyindi-client-$PYINDI_CLIENT_VERSION.tar.gz && cd pyindi-client-$PYINDI_CLIENT_VERSION && python3 setup.py install && cd / && rm -rf pyindi-client-$PYINDI_CLIENT_VERSION
VOLUME /usr/local/lib/python3.6/dist-packages

WORKDIR /app
ENV PYTHONPATH="/app/indi-lite-tools" LANG=C.UTF-8 LC_ALL=C.UTF-8 WEB_THREADS=4 ENABLE_PTVSD=false
COPY astrophotoplus-wifi-helper /usr/bin
COPY shutdown-docker-helper /usr/bin
RUN mkdir -p /root/.config/AstroPhotoPlus
COPY commands.json /root/.config/AstroPhotoPlus/commands.json
COPY entrypoint /entrypoint
CMD /entrypoint
