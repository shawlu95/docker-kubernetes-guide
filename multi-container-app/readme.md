## Multi-Container App

This is a realistic-looking app which allows user to create, read and delete goals. It consists of three images

- mongo
- nodejs API
- react front-end

Features:

- mongo data must survive container shutdown
- source code changes are instantly taking effect without rebuilding image/restarting container
- restrict access to mongo

```bash
cd ./multi-container-app
docker run --name mongodb --rm -d -p 27017:27017 mongo

cd ./backend
docker build -t goals-backend .
docker run --name goals-backend --rm -d -p 80:80 goals-node

# the react app must be run in interactive mode, or it will immediately stop
docker build -t goals-react .
docker run --name golas-frontend --rm -d -p 3000:3000 -it goals-react
```
