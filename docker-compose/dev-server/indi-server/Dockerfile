FROM ubuntu:artful
RUN apt-get update && apt-get install -y dirmngr 
COPY indi-ppa.list /etc/apt/sources.list.d/
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 3F33A288 && apt-get update && apt-get install -y indi-full 
ENV INDI_DEVICES="indi_simulator_ccd indi_simulator_wheel indi_simulator_telescope"
COPY entrypoint /entrypoint
CMD /entrypoint $INDI_DEVICES
