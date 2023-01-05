## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run DB via Docker
* Do first: copy file with rename `docker-compose.yml.example` to `docker-compose.yml` by command 
* `cp ./docker-compose.yml.example ./docker-compose.yml`
* 
* Do second: `docker-compose up` run command to build DB instance and CTRL+C to stop
* When build exists you can run instance in detached mode:
* `docker-compose start` to start and `docker-compose stop` to stop DB instance
* 
* Always connections settings:
* user `mongouser`, password `mongopassword`, port `27017`, DB `onix-internship-group3`, AUTHENTICATION DATABASE `admin`

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```