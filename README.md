# WIP: Sg Lta Stats
> Exploring singapore lta data mall

## Quickstart

```sh
# Start mysql
yarn start:db
# DB Migrations
yarn start db.migrate
# Start dev mode
yarn start serve
```

## Populate data

| Endpoint | Description |
| ---- | ---- |
/api/busStop/update | Update db with bus stop information, including their location
/api/passengerVol/update | Update db with the passenger volume for each origin and destination bus stop


## Credits
- Based from [Express Typescript Boilerplate](doc/boilerplate.md)

