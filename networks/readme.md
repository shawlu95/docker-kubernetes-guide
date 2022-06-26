## Networking

- outside www: can directly communicate, no special config is needed
- local host (mongo db):
  - this does not work: `mongodb://localhost:27017/swfavorites`
  - this works (no need to start container differently): `mongodb://host.docker.internal:27017/swfavorites`

```bash
cd networks

docker build -t networks .

# start a mongo db container from the official mongo image: https://hub.docker.com/_/mongo
docker run -d --name mongodb mongo

# check NetworkSettings.IPAddress
# place the IP in mongoose.connect
docker inspect mongodb


docker run --name networks -d -p 3000:3000 networks
```
