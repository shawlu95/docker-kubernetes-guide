### Basic Command

- Start a shell in container: `docker run -it $image_id sh`
- Start an interactive process in a running container: `docker exec -it $CONTAINER_ID sh`

```bash
# Check running container:
docker ps
docker ps -a
docker ps --all

# "run" is equivalent to create and start
docker run
docker create
docker start <container id>

# free disk space
docker system prune
docker system prune -a

docker logs <container id>

# graceful shutdown
docker stop <container id>

# instant kill
docker kill <container id>

# execute command in container
# i: attach standard input to the process
# t: format nicely
docker exec -it <container id> <command>

# another way to run container, and attach shell
docker run -it <container id> sh
```

##### How to get container

To get a prebuilt container from docker hub, find it's name, pull to local, and run it

```bash
# optional
docker pull node

# willl pull to local if not found
rocker run node
```

##### Attached vs Detatched Mode

```bash
# start container in detatched mode
docker start $image_id

# start container in attached mode
docker start -a $image_id

# start container in attached mode
docker run $image_id

# start container in detatched mode
docker run -d $image_id

# find container name in docker ps
# attach to running container without restarting
docker container attach $CONTAINER_NAME/ID

# see all logs in the past
docker logs $CONTAINER_NAME/ID
docker logs -f $CONTAINER_NAME/ID # keep listening in stream
```

##### Remove Container

- Cannot `rm` running container

```bash
# see all stopped container
docker ps -a
docker stop $CONTAINER_NAME
docker rm $CONTAINER_NAME_1 $CONTAINER_NAME_2 ...

# remove all stopped containers
docker container prune

# auto-remove container after being stopped
docker run --rm $image_id
```

##### Cleanup images

- can only remove images that are not used by containers (including stopped containers)
- must remove stopped containers before removing images!

```bash
# check all images and sizes
docker images

# remove image and all layers, pass in image_id
docker rmi $image_id

# remove all unused images
docker image prune

# inspect image
docker inspect $image_id
```

##### Copy file into container

- pretty error prone, rarely used in practice
- copy logs file out of containers is a common use case

```bash
docker cp $path_local $container_name:/app
docker cp $container_name:/app $path_local
```

##### Tagging the image:

- Format: `$REPO:$TAG`, repo is also called `name`
- "alphine" means simplest version, absolute minimum

```bash
docker build -t shaw/exercise:v0 .
docker build -t shaw/node_app .

docker run shaw/exercise:v0
```

Start container with name

```bash
docker run -p 3000:80 -d --rm --name my_container $container_id
```

#### Sharing Image

```bash
# push & pull docker hub
docker push shawlu95/$image_name
docker pull shawlu95/$image_name

# push & pull private registry
docker push $host:$image_name
docker pull $host:$image_name

# tagging image would create a new image, without deleting the old
docker tag python_app:v0 python_app:v1

# must login when trying to push new images
docker login

# can also logout
docker logout
```

##### Run alpine and start a shell

```bash
docker run -it alpine sh
```

#### Working Directory

In practice, do not copy everything `COPY ./ ./`. Have a dedicated working directory for the project.

- Specify project dir before copy
- Directory will be created if not exists

```bash
WORKDIR /usr/app
COPY ./ ./
```

#### Manual Build

Create a new image from a docker container manually using docker commit

1. take a container
2. do something
3. generate a new image
4. not so often used in real work

```bash
docker commit -c 'CMD ["redis-server"]' $CONTAINER_ID
```

### Useful

- Docker image repo: [http://hub.docker.com/explore](http://hub.docker.com/explore)
