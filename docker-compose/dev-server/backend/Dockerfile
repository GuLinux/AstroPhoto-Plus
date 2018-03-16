FROM ubuntu:artful
VOLUME /app

ENV INDI_SERVER_HOST="indiserver" REDIS_URL=redis://redis:6379 FLASK_DEBUG=1 FLASK_APP="./indi-lite.py" PYTHONPATH="/pythonpath" LANG=C.UTF-8 LC_ALL=C.UTF-8 PYINDI_CLIENT_VERSION=0.2.2

RUN apt-get update && apt-get install -y swig build-essential libnova-dev  python3 python3-pip dirmngr swig build-essential libnova-dev libcfitsio-dev zlib1g-dev curl
COPY indi-ppa.list /etc/apt/sources.list.d/
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 3F33A288 && apt-get update && apt-get install -y libindi-dev
RUN curl -o pyindi-client-$PYINDI_CLIENT_VERSION.tar.gz "https://pypi.python.org/packages/3d/2c/66e96ab58e2cb5137986c53d8747edc8fb3001340120c62a4dab998f0a2b/pyindi-client-$PYINDI_CLIENT_VERSION.tar.gz#md5=b5ca6db1b587970ad774c3d884dbef3a" && tar xzf pyindi-client-$PYINDI_CLIENT_VERSION.tar.gz && cd pyindi-client-$PYINDI_CLIENT_VERSION && python3 setup.py install && cd / && rm -rf pyindi-client-$PYINDI_CLIENT_VERSION

WORKDIR /app
CMD pip3 install -r requirements.txt; flask run -h 0.0.0.0 --with-threads
