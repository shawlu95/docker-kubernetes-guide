## Deployment

- dev mode: encapsulate the runtime environment but not the source code, which is in bind mount
- prod mode: container is standalone, single source of truth and encapsulates all the app needs

```bash
# build the image
docker build -t node-depl-example .

# start app on localhost:8080
docker run -d --rm --name node-depl -p 8080:8080 node-depl-example
```
