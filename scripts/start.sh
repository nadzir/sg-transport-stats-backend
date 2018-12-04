#!/bin/sh

# Start db docker
# docker stop mysql; docker rm mysql; yarn start:db
# migrate
yarn start db.migrate
# update bus stop
curl localhost:3000/api/busStop/update
# update passenger volume
curl localhost:3000/api/passengerVol/update
