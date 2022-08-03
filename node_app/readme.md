#### NodeJS Example

- Build from node:alpine base image
- Copy file to container
- Build and tag image
- Run image
- Setup port mapping: _a runtime constraint_
  - Only for incoming requests
  - No limit on container's ability to reach outside

```bash
# mapping local machine's 3000 to port 8080 in container
docker run -p 3000:8080 $image_id
```

Pracrtice: push this to DockerHub and start a container using ECS

```bash
cd node_app
docker build --platform=linux/amd64 -t shawlu95/node-app .
docker push shawlu95/node-app

# run locally for sanity check
docker run --rm -d -p 3000:80 shawlu95/node-app
```
