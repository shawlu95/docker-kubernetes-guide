```bash

docker build -t feedback-node:volume .

docker run -d -p 3000:80 --rm --name feedback-app feedback-node:volume

docker rmi feedback-node:volume

docker run -d -p 3000:80 --rm --name feedback-app -v feedback:/app/feedback feedback-node:volume

docker stop feedback-app

docker volume ls

# restart container data should still exist
docker run -d -p 3000:80 --rm --name feedback-app -v feedback:/app/feedback feedback-node:volume
```
