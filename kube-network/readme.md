## Networking

This module is about connecting different services.

- three node apps, three containers
- all apps use dummy data. We don't care about data storage & persistent in this module

Architecture

- users and auths container run in the **same** pod
- users API reaches out to auth API for password check, login token
- task API lives on a **separate pod**
- auth API is not exposed any port to the public, only accessible from internal

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
