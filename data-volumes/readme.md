```bash

docker build -t feedback-node:volume .

docker run -p 3000:80 --rm --name feedback-app feedback-node:volume

docker rmi feedback-node:volume

docker run -d -p 3000:80 --rm --name feedback-app -v feedback:/app/feedback feedback-node:volume

docker stop feedback-app

docker volume ls

# named volume, restart container data should still exist
docker run -d -p 3000:80 --rm --name feedback-app -v feedback:/app/feedback feedback-node:volume

# must give access to docker (by default, user's folder is shared)
# using bind volume folder (can also bind single file)
docker run -d -p 3000:80 --rm --name feedback-app \
  -v "/Users/shaw.lu/Documents/proj/docker-basics/data-volumes/feedback:/app/feedback" feedback-node:volume

# interesting use case: exclude node_modules from bind volume
# instandly pick up code change without rebuilding image

# a complex use case
# feedback:/app/feedback: a named volume, writable by container, but do not write user data into host volume
# /app/temp: anonymous, no need to persist
# /app/node_modules: anonymous, do not override node_modules
# /app:ro: ro means read-only, only host can change
docker run -d -p 3000:80 --rm --name feedback-app -v feedback:/app/feedback -v /app/temp -v /app/node_modules -v "/Users/shaw.lu/Documents/proj/docker-basics/data-volumes:/app:ro" feedback-node:volume

# see node server should restart after changes
docker logs feedback-app

# can create volume manually in advance
docker volume create new-volume

# theen pass the named volume when starting up container
# docker run -d -p 3000:80 --rm --name feedback-app -v new-volume:/app/feedback ...

# can remove if not currently in use
docker volume rm new-volume

# remove all local volumes not used by at least one container.
docker volume prune

docker volume inspect feedback
```

Environment variable

```bash
docker build -t feedback-node:env .

docker run -d -p 3000:80 --rm --name feedback-app -v feedback:/app/feedback -v /app/temp -v /app/node_modules -v "/Users/shaw.lu/Documents/proj/docker-basics/data-volumes:/app:ro" feedback-node:env

# override port --env PORT=8000, or -e
# can have multiple -e flags
docker run -d -p 3000:8000 --env PORT=8000 --rm --name feedback-app -v feedback:/app/feedback -v /app/temp -v /app/node_modules -v "/Users/shaw.lu/Documents/proj/docker-basics/data-volumes:/app:ro" feedback-node:env

# use .env file
docker run -d -p 3000:8000 --env-file ./.env --rm --name feedback-app -v feedback:/app/feedback -v /app/temp -v /app/node_modules -v "/Users/shaw.lu/Documents/proj/docker-basics/data-volumes:/app:ro" feedback-node:env
```

Build argument

- lock certain values when building images
- declare build arg right before use in Dockerfile because it creates a new layer

```
docker build -t feedback-node:dev --build-arg DEFAULT_PORT=8000 .
docker history feedback-node:dev
docker rmi feedback-node:dev
```
