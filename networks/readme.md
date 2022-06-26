## Networking

- outside www: can directly communicate, no special config is needed
- local host (mongo db):
  - this does not work: `mongodb://localhost:27017/swfavorites`
  - this works (no need to start container differently): `mongodb://host.docker.internal:27017/swfavorites`

```bash
cd networks

docker build -t fav .

# start a mongo db container from the official mongo image: https://hub.docker.com/_/mongo
docker run -d --name mongodb mongo

# check NetworkSettings.IPAddress
# place the IP in mongoose.connect: e.g. 'mongodb://172.17.0.2:27017/swfavorites'
docker inspect mongodb

docker run --name fav_app -d -p 3000:3000 fav
```

### Container Networks

- in docker run command, add container to the same networks: `docker run --network my_network ...`
- network must be manually created before running `docker run`
- if two containers are in the same network, one can just reference the other by **name** (`--driver bridge` mode, which is most common)
- mongo container does not need to expose port to outside port (`-p`), because containers can communicate freely within network

```bash
docker network --help
docker network create my_net
docker network ls

# start mongo container, don't need -p option, which is only required if need to connect outside of network
docker run -d --name mongodb --network my_net mongo

# start app container, ref mongo by name: mongodb
docker build -t fav .
docker run --name fav-app --network my_net -d -p 3000:3000 fav
```
