# Imperative Approach

## Deployment

- Install minikube `brew install minikube`
- build and push image
- create deployment using the image
- create service that exposes deployment

```bash
docker build -t kube-first-app .

# start minikube cluster (mac M1)
# should be able to see "minikube" context in docker desktop
minikube start --driver=docker

docker tag kube-first-app shawlu95/kube-first-app
docker push shawlu95/kube-first-app

# create a deployment and auto-send to cluster
# image must be absolute path, reachable from the K8s
kubectl create deployment first-app \
  --image=shawlu95/kube-first-app

kubectl get deployment

minikube dashboard
```

## Service

Create a service by exposing a deployment

```bash
# minikube support load balancer
kubectl expose deployment first-app --type=LoadBalancer --port=8080

# expose the service by assigning it to a URL
# will open automatically in browser
minikube service first-app
```

## Scaling

- manually crash the program by `/error` route and watch it restarts
- create two more replicas
- crash the app and immediately visit the home route, should be rerouted to another pod

```bash
# add two new pod
kubectl scale deployment/first-app --replicas=3

kubectl delete deployment first-app

kubectl scale deployment/first-app --replicas=1
```

## Update

1. Change code
2. Rebuild image, with **different tag** (tag must be different)
3. Push image
4. set new image for deployment
5. check rollout status: doesn't shut down old container before new one is ready

```bash

docker build -t shawlu95/kube-first-app:v2 .
docker push shawlu95/kube-first-app:v2

# set image for the deployment named "first-app", old image name = new image name
kubectl set image deployment/first-app kube-first-app=shawlu95/kube-first-app:v2

# check status, should see "successfully rolled out", should also see change in browser
kubectl rollout status deployment/first-app
```

How to manage failed rollout

- for example, specify an image tag that doesn't exist
- roll out will be stuck
- old container will still be running
- undo deployment

```bash
kubectl set image deployment/first-app kube-first-app=shawlu95/kube-first-app:v3
kubectl rollout status deployment/first-app
kubectl get pod

# NAME                         READY   STATUS         RESTARTS   AGE
# first-app-74bd9d78f4-j5hxt   0/1     ErrImagePull   0          10s
# first-app-78c5f8b7df-c727v   1/1     Running        0          5m21s

kubectl rollout undo deployment/first-app
```

Revert to older deployment

```bash
# check list of revision
kubectl rollout history deployment/first-app

# zoom in on one revision ()
kubectl rollout history deployment/first-app --revision=1

# roll back to earliest deployment (equal sign required)
kubectl rollout undo deployment/first-app --to-revision=1
```

Clean up

```bash
kubectl delete service first-app
kubectl delete deployment first-app
```

---

# Declarative Approach

- create **resource definition file**:
  - [deployment.yaml](./deployment.yaml)
  - [service.yaml](./service.yaml)
- we don't want to manually run all the command (like we did with `docker run`...)
- instead, we want something like docker-compose (declarative): `kubectl apply -f config.yaml`
  - the config file is used to define desired state (and change state)
  - if reapply, k8s will check the difference and apply the change

```bash
kubectl apply -f ./deployment.yaml
kubectl get deployment

kubectl apply -f ./service.yaml
kubectl get service

# expose the service named "backend"
minikube service backend
```

## Yaml Note

- find latest API version [here](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- see available Deployment options [here](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/deployment-v1/)
- selector can be `matchLabels` or `matchExpression`, tell deployment which pods to control
- see Service config options [here](https://kubernetes.io/docs/reference/kubernetes-api/service-resources/service-v1/)
