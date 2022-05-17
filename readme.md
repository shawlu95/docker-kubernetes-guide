### Basic Command
* Check running container: `docker ps`
* Stop a running container: `docker stop $CONTAINERID`
* Start a shell in container: `docker run -it $IMAGE_ID sh`
* Start a second process in a running container: `docker exec -it $CONTAINER_ID sh`

```bash
docker ps
docker ps --all

# "run" is equivalent to create and start
docker run
docker create
docker start <container id>

# free disk space

docker system prune
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

##### Tagging the image:
* Format: `$REPO:$TAG`
* "alphine" means simplest version, absolute minimum
```bash
docker build -t shaw/exercise:v0 .
docker build -t shaw/node_app .
```

##### Run alpine and start a shell
```bash
docker run -it alpine sh
```

##### Copy file into container
* First dir is relative to *build context*
```bash
# copy everything in current dir into container
COPY ./ ./
```

#### NodeJS Example
* Build from node:alpine base image
* Copy file to container
* Build and tag image
* Run image
* Setup port mapping: *a runtime constraint*
  - Only for incoming requests
  - No limit on container's ability to reach outside
```bash
# mapping local machine's 3000 to port 8080 in container
docker run -p 3000:8080 $IMAGE_ID
```

#### Working Directory
In practice, do not copy everything `COPY ./ ./`. Have a dedicated working directory for the project.
* Specify project dir before copy
* Directory will be created if not exists
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
* Docker image repo: [http://hub.docker.com/explore](http://hub.docker.com/explore)