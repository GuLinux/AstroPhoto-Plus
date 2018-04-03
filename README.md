# StarQuew Server

A lightweight, web based sequence generator and INDI client written in Python and React.

## Get the sources

Run the following command:
```
git clone --recurse-submodules https://github.com/GuLinux/StarQueW
```
Note: the `--recurse-submodules` is important since the repository contains a link to another repository.
Similarly, when updating the repository you need to specify the parameter again:

```
git pull --recurse-submodules
```

## Install

TODO

## Deploy via Docker

### Prerequisites

Right now using docker is the preferred way of using StarQueW due to the very minimal amount of dependencies required.

 - Install `docker` and `docker-compose`. Please refer to your distribution documentations on the installation procedure, or docker official pages at [https://docs.docker.com/install/](https://docs.docker.com/install/) and [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/).

 - Start your INDI server, either via command line, or using INDI Web Manager
 - Find your ip address. This is very important, since containers inside docker need your public IP address in order to access INDI Server. You can either use your lan/wan IP address (example: `192.168.0.10`) or the IP address of your `docker0` interface (usually `172.17.0.1`). The `INDI_SERVER_HOST` environment variable will be passed to the docker containers to let them now the right address to use.

### Start the production server

This option will start an optimized version of the application (javascript and minified, no debug code, etc).

```
cd docker-compose/prod
docker-compose build # only necessary the first time, or after you update the project
INDI_SERVER_HOST=<YOUR_IP_ADDRESS> docker-compose up
```

### Development server

A docker based development server is provided in the `docker-compose/dev-server/` directory.
This also includes a test INDI Server with simulators, but you can still use your own INDI server following the same instructions of the PRODUCTION server.

To bring it up, just run the following:

```
cd docker-compose/dev-server/
docker-compose build    # only necessary if you are updating from a previous version
docker-compose up\
```




