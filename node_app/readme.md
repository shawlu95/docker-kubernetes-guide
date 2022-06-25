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
