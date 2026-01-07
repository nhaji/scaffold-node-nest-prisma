# skeleton-nnp

Core business

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## 🚀 Quick Start

### Env setup

```bash
# Copy template
$ cp .env.example .env

# Edit with your values
$ nano .env
```
### Database Setup for DEV

```bash
# Create docker network
$ docker network create ${NETWORK_NAME}

# Launch postgreSQL
$ cd postgres
$ ./start.sh

# For first seeds for the database (The seeds are located in prisma/seeds/data)
$ npm run prisma:seed

```

### Project setup

```bash
$ npm install
```

### Prisma setup

```bash
# Generate code from an update in schema
$ npx prisma generate

# Generate code with hot reload 
$ npx prisma generate --watch

# Generate the migrations file
$ npx prisma migrate dev --name <FEATURE_NAME>

# Deploy the updates to the database 
$ npx prisma migrate deploy

# Reset the Database
$ npx prisma migrate reset

# Check the database
$ npx prisma db pull
```


### Compile and run the project

```bash

# development
$ nest start

# watch mode
$ nest start --watch

# debug mode
$ nest start --debug --watch

# production mode
$ node dist/main
```

### Run tests

```bash
# unit tests
$ jest

# e2e tests
$ jest --config ./test/jest-e2e.json

# test watch 
$ jest --watch

# test coverage
$ jest --coverage
```



### Docker Setup
```bash
# Create docker network
docker network create ${NETWORK_NAME}

# Make scripts executable
chmod +x start.sh stop.sh build.sh

# Build the docker image
./build.sh

# Start the server
./start.sh
```

### 2. Verify Installation
```bash
# Check app status
curl http://localhost:${EXPOSED_PORT}/${HEALTH_CHECK_ENDPOINT}$

# Check openapi
curl http://localhost:${EXPOSED_PORT}/${SWAGGER_PREFIX}$

# Check openapi file
curl http://localhost:${EXPOSED_PORT}/${SWAGGER_PREFIX}-json$
```

### API tests

For More Info about the config check https://schemathesis.readthedocs.io/en/stable/reference/configuration/

```bash
$ cd schemathesis
$ ./start.sh
```

### API Load tests

```bash
$ cd locust
$ ./start.sh
```