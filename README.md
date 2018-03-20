# INDI-Lite Server

A lightweight, web based sequence generator and INDI client written in Python and React.

## Install

TODO

## Development server

A docker based development server is provided in the `docker-compose/dev-server/` directory.

To bring it up, just run the following:

```
cd docker-compose/dev-server/
docker-compose build    # only necessary if you are updating from a previous version
docker-compose up
```

This will also start an INDI server with a few simulators.
If you want to use an INDI server on your host machine, first find your IP address on the docker network, this will usually be `docker0`.
```
ifconfig docker0
```

It will usually be `172.17.0.1`, but it may vary between installations.

Then, export the following variable:
```
export INDI_SERVER_HOST=172.17.0.1
```

And finally, start the development server as described above.



