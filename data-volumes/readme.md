```bash

docker build -t feedback-node:volume .

docker run -d -p 3000:80 --rm --name feedback-app feedback-node:volume

docker rmi feedback-node:volume

docker run -d -p 3000:80 --rm --name feedback-app -v feedback:/app/feedback feedback-node:volume

docker stop feedback-app

docker volume ls

# restart container data should still exist
docker run -d -p 3000:80 --rm --name feedback-app -v feedback:/app/feedback feedback-node:volume

# must give access to docker (by default, user's folder is shared)
# using bind volume folder (can also bind single file)
docker run -d -p 3000:80 --rm --name feedback-app \
  -v "/Users/shaw.lu/Documents/proj/docker-basics/data-volumes/feedback:/app/feedback" feedback-node:volume

# interesting use case: exclude node_modules from bind volume
# instandly pick up code change without rebuilding image
docker run -d -p 3000:80 --rm --name feedback-app \
  -v "/Users/shaw.lu/Documents/proj/docker-basics/data-volumes:/app" \
  -v /app/node_modules feedback-node:volume

docker logs feedback-app
```
