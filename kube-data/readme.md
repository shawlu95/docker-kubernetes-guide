## Manage Volume in Kubernetes

### Getting Started

- write and read a story in the [story](./story/)
- to start locally, `docker-compose up -d --build`
- send request from postman

### K8s Volume

- have different drivers and types (more flexible)
  - docker volumes have no driver/type support
  - see types of volumes in official [doc](https://kubernetes.io/docs/concepts/storage/volumes/)
  - this course focuses on `emptyDir`, `CSI` and `hostPath`
- survive container restart, but not Pod restart
  - docker has no concept of Pod

```bash
docker build -t shawlu95/kube-data-demo .
docker push shawlu95/kube-data-demo

# start minikube if not runnning
minikube status
minikube start --driver=Docker

kubectl apply -f service.yaml,deployment.yaml

minikube service story-srv
```
