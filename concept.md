Docker

- a container technology, for creating and managing containers

Image

- Template/blueprints for greating containers
- ~ class definition in OOP
- images are layer-based, built layers are cached
  - if a step is changed, only the ensuing steps are rebuilt
  - each step generates a new image (intermediate image)

Container

- a standardized **running** unit of software
- uses OS built-in(or emulated) container support
- ~ instances of a class in OOP

Virtual Machines

- pros: similar to container, provide separated env & config
- cons: OS is installed in every virtual machine, consume lots of resource, long boot time

Sharing Images

- share Dockerfile, anyone can build image based on it
- share built images: push to Docker Hub or private registry
- caveat: `docker run` will pull if not found in local, but will not pull `latest` if already exists on local

Data

1. static code files
2. volatile data, can be lost (e.g. user input, app state)
3. permanent data, cannot be losed, but store in volume

Volume

- container data are lost when containers are **remvoed** (not removed when stopped)
- docker has built-in support for volume
- volume is folder on **host** machine, mounted into container
- changes in either location will be captured by the other location (back and forth host and container)
- anonymous volumes:
  - `VOLUME [ "/app/feedback" ]` no path on host machine
  - can also do `-v /app/feedback` in docker run command
  - get via `docker volume ls`
  - only exists as long as containers exist (not removed)
  - important: must attach `--rm` when running container to remove volume after shutdown, manual removal will not actually delete volume
  - must manually do `docker volume rm VOL_NAME` or `docker volume prune` to clear dangling images
- named volumes:
  - will survive container shutdown
  - don't have direct write access, only used to persit data across container lifecycle
- Bind Mounts
  - developer sets the local host path
  - can put source code into bind mount
  - danger: do no override the folder where node_modules is installed
- multiple `-v` can be entered at docker run command, more specific path will override more general path

Argument

- available in dockerfile, not app code
- set when building image with `docker build --build-arg`

Env Variable

- available in dockerfile and application
- set when starting container `docker run --env`, or `-e` (multiple flag can be accepted)
- can pass in env files `--env-file ./.env`
- **warning** do not write credential into Dockerfile, which can be looked up via `docker history $image_name`
  - write credentials into `.env` file and never commit it to version control

---

# Kubernetes

- just like docker-compose, but works on cluster
- pod is a logical group of >= 1 containers and required resources (e.g. volume)
  - smallest unit that Kubernetes interacts with
  - has a cluster-interal IP, containers can refer to each other as localhost
  - pods are disposable, short-lived (by design decision)
- deployment: manages pods to be created, stopped, replaced
  - set a target state, e.g. two pods of specific containers
  - can pause and rollback deployment to fix bug
  - deployment can be scaled dynamically
- service: expose pods to cluster or outside world
  - internal IP changes when pod gets replaced (not reliable)
  - groups pods together with a shared IP

Deployment type:

- ClusterIP: only reachable from inside cluster
- NodePort: exposed to the outside by IP
- LoadBalancer: generate unique address for this service and evenly distribute traffic

## AWS EKS (Kubernetes) vs ECS (Container)

- EKS is for Kubernetes deployment, can just apply existing k8s config
  - stay in the K8s world of API (config, resource, object), no AWS specific things
- ECS general service for container, doesn't know k8s config file
  - has a a bunch of AWS-specific syntax and philosophy and concept (not good)
