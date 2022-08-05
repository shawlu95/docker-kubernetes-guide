## Networking

This module is about connecting different services.

- three node apps, three containers
- all apps use dummy data. We don't care about data storage & persistent in this module

### Architecture

- users and auths container run in the **same** pod
- users API reaches out to auth API for password check, login token
- task API lives on a **separate pod**
- auth API is not exposed any port to the public, only accessible from internal

### Step 1: Users API

Build and start all apps using `docker-compose up -d --build`

Service types:

- cluster IP: internal, only reachable from inside
- NodePort: still an IP, but reachable from outside
- LoadBalancer: best option, gives public IP, distributes traffic across **nodes** (not just containers/pods)

```bash
docker build -t shawlu95/kube-network-users .

docker push shawlu95/kube-network-users

cd ..
kubectl apply -f kubernetes/users-depl.yaml

# expose service on port
kubectl apply -f kubernetes/users-srv.yaml

# not needed in prod
minikube service users-srv
```

---

### Step 2: Auth API

- Docker compose place all containers in same network, so can use service name as domain e.g. `http://auth/...`
- Best practice: use environment variable for the domain
  - [docker-compose.yaml](./docker-compose.yaml) is also modified with the env variable
- We want Auth container in the same pod as User container
  - can refer to each other as **localhost**
- A new deployment file would create a new (kind) Pod! One file can created multiple "replicas"
- Auth is **not** publicly accessible, no need to configure it in [users-depl.yaml](./users-api/users-app.js)
  - Users API sends out intra-pod API call to Auth API

```bash
docker build -t shawlu95/kube-network-auth

docker push shawlu95/kube-network-auth

kubectl apply -f kubernetes/users-depl.yaml

# start serving if not already up
minikube serrvice users-srv
minikube dashboard

# create a user by calling sign up route
# check container log
kubectl logs $pod_name
# Defaulted container "users" out of: users, auth
# dummy foo@gmail.com
```

Alternatively, deploy Auth in a separate Pod

- create [auth-depl](./kubernetes/auth-depl.yaml) and only keep auth container
- delete auth container from [users-depl](./kubernetes/users-depl.yaml)
- create [auth-srv](./kubernetes/auth-srv.yaml) that exposes port 80, and uses **ClusterIP** (non-public facing)
- users container refers to auth API by Cluster-IP, instead of "localhost"
  - each service has its IP address which do not change
  - need to find out manually

```bash
cd kubernetes

kubectl apply -f auth-depl.yaml,auth-srv.yaml

# lookup the "CLUSTER-IP" and save it as env variable AUTH_ADDRESS
kubectl get services

kubectl apply -f users-depl.yaml
```

- alternatively, use Kubernetes-generated environment variable
- e.g. for `auth-srv` service, refer to its address as `process.env.AUTH_SRV_SERVICE_HOST`

```bash
cd users-api

docker build -t shawlu95/kube-network-users .

docker push shawlu95/kube-network-users

cd ../kubernetes

kubectl delete -f users-depl.yaml
kubectl apply -f users-depl.yaml
```

- alternatively, refer to service's name and namespace
- e.g. `auth-srv.default`

```bash
kubectl get namespaces

cd kubernetes
kubectl apply -f users-depl.yaml
```

## Setup Tasks API

- add [tasks-depl](./kubernetes/tasks-depl.yaml)
  - add `AUTH_URL` env variable
  - add `TASK_FOLDER` env variable
- add [tasks-srv](./kubernetes/tasks-srv.yaml)

```bash
cd tasks-api

docker build -t shawlu95/kube-network-tasks .
docker push shawlu95/kube-network-tasks

cd ../kubernetes
kubectl apply -f tasks-depl.yaml,tasks-srv.yaml

kubectl get service

# important: on local environment, need to expose it on a different port!
minikube service tasks-srv
```

## Setup React App

Without managing the front-end in K8s cluster.

```bash
cd frontend

docker build -t shawlu95/kube-network-react .

# no need
# docker push shawlu95/kube-network-react

docker run -p 3000:80 --rm -d shawlu95/kube-network-react
```

Cross-origin resource sharing (CORS)

- postman can access API as please
- browser app needs to be CORS-allowed
  - add appropriate headers in [task-app](./tasks-api/tasks-app.js)

```bash
cd tasks-api

docker build -t shawlu95/kube-network-tasks .

docker push shawlu95/kube-network-tasks

cd ../kubernetes
kubectl delete -f tasks-depl.yaml
kubectl apply -f tasks-depl.yaml
```

Nit: must create at least one task via Postman, for front-end to load. Otherwise would crash.

Manage front-end in Kubernetes cluster

```bash
docker push shawlu95/kube-network-react

cd ../kubernetes

kubectl apply -f react-depl.yaml,react-srv.yaml

minikube service react-srv
```

---

## Reverse Proxy in React App

- if a requests target `/api`, route to task service IP

```bash
  location /api {
    proxy_pass http://127.0.0.1:53631;
  }
```

Deploy

```bash
cd frontend

docker build -t shawlu95/kube-network-tasks .

docker push shawlu95/kube-network-tasks

cd ../kubernetes

kubectl delete -f react-depl.yaml,react-srv.yaml

kubectl apply -f react-depl.yaml,react-srv.yaml
```

---

## Take-away

- avoid placing multiple containers in same pod unless tighly coupled (poor design)
- each pod needs a service object
- three options to reference a pod
  - by hard-coding cluster-ip
  - use auto-generated environment variable
  - use auto-generated domain name (most common)
