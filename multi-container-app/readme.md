## Multi-Container App

This is a realistic-looking app which allows user to create, read and delete goals. It consists of three images

- mongo
- nodejs API
- react front-end

Node code is running on server. React code is running on browser! (outside of container) Cannot use container name in react code. So still need to expose node port so browser can reach it.

Features:

- mongo data must survive container shutdown
- source code changes are instantly taking effect without rebuilding image/restarting container
- restrict access to mongo

```bash
cd ./multi-container-app

docker network create goals-network

docker run --name mongodb --rm -d --network goals-network mongo

cd ./backend
docker build -t goals-backend .

# node needs network to reach mongo
# also needs to expose port to browser app
docker run --name goals-backend --rm -d --network goals-network -p 8080:8080 goals-backend

# the react app must be run in interactive mode, or it will immediately stop
cd ./frontend
docker build -t goals-react .

# don't need network, but still need to expose port
docker run --name goals-frontend --rm -d -p 3000:3000 -it goals-react
```

### How to Persist Data across Container Removal

1. using named volume: `-v data:/data/db`
2. using bind mount: `-v $LOCAL_PATH:/data/db`

```bash
# using named volume
docker run --name mongodb --rm -d --network goals-network -v data:/data/db mongo
```
