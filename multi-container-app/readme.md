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
docker run --name goals-backend --rm goals-node
```
