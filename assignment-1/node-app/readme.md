```bash
cd node-app
docker build .
docker run -p 8000:3000 $image_id

# start container with name, auto-remove after stop
docker run -p 8000:3000 -d --rm --name my_container $container_id
docker stop my_container

# see all stopped container
docker ps -a
docker stop $CONTAINER_NAME

# delete unmaed images by id
docker rmi $image_id

# build image with name
docker build -t node_app .
docker run -p 8000:3000 -d --rm --name node_app_container node_app:latest
docker stop node_app_container
```
