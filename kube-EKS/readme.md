## Amazon Elastic Kubernetes Service

- this is a simplified version of previous module
  - only two containers
  - each yaml file contains the **Service** and **Deployment** combined
  - User service exposes the internal 3000 to external 80 (LoadBalancer)
  - Auth is private (ClusterIP)

```bash
# create cluster secert
kubectl create secret generic mongo-pass --from-literal=mongo_pass=bar
```
