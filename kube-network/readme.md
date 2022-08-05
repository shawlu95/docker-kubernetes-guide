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
