### Basic Command
* Check running container: `docker ps`
* Stop a running container: `docker stop $CONTAINERID`

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