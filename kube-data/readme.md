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

Add the `/error` route

```bash
docker build -t shawlu95/kube-data-demo:v3 .
docker push shawlu95/kube-data-demo:v3
kubectl apply -f deployment.yaml
```

Add `volumeMounts` to deployment spec.

Apply volume bind in [deployment.yaml](./deployment.yaml)

Reapply the yaml

- first get request would fail, but that's ok
- call `/error` to crash container
- call get `/story` again, should see data persist

```bash
kubectl apply -f deployment.yaml
```

### Pods Share Volume

- set `hostPath` instead of `emptyDir`
- instead of passing empty dir object, pass in a nested dict `{path: ..., type: ...}`
- crash one pod, but can still access data immediately from another pod
- **cons**: pods must be on **same node** to access the data

### Multi-node Share Volume

- Amazon Container Service Interface (CSI) built on top of Elastic File System (EFS)
  - a cloud provider-specific thing
  - required for real deployment where multiple nodes share the same volume
- Kubernetes refers to this as **persistent volume**
  - not be removed after pod shut down
  - pod and node-independent, not lost if pod is lost
  - no need to modify multiple pod yaml file, simplify maintenance
  - _persistent volume claim_ is attached to each pod, allowing pod/node to reach out to standalone persistent volume (on some cloud storage, e.g. CSI)
  - implemented as plugin
  - multiple plugins are available (for different providers)
- volume mode:
  - _Filesystem_:
  - _Block_:
    Step of using persistent volyme
- make persistent volume in [host-pv.yaml](./host-pv.yaml)
- make PV claims in [host-pvc.yaml](./host-pvc.yaml): a pod can use this claim on a PV
  - ok to merge this with the [host-pv.yaml](./host-pv.yaml)
- use the persistent volume in [deployment.yaml](./deployment.yaml)

### Storage Class

- give administrator fine-grained control over storage
- check available storage class: `kubectl get sc`
- used in persistent storage claim yaml

```bash
kubectl apply -f host-pv.yaml
kubectl apply -f host-pvc.yaml
kubectl apply -f service.yaml
kubectl apply -f deployment.yaml

kubectl get pv
# NAME      CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM              STORAGECLASS   REASON   AGE
# host-pv   1Gi        RWO            Retain           Bound    default/host-pvc                           3m51s

kubectl get pvc
# NAME       STATUS   VOLUME    CAPACITY   ACCESS MODES   STORAGECLASS   AGE
# host-pvc   Bound    host-pv   1Gi        RWO            standard       2m56

kubectl get deployments
```

### Env Variable Good Practice

- specify volume data path as env variable
- no need to change source code and push image anymore!

```bash
docker build -t shawlu95/kube-data-demo:v4 .

docker push shawlu95/kube-data-demo:v4

kubectl apply -f deployment.yaml

kubectl get pod
```

Alternative method

- store **ConfigMap** yaml: [environment.yaml](./environment.yaml)
- references `configMapKeyRef` from [deployment.yaml](./deployment.yaml)

```bash
kubectl apply -f environment.yaml
kubectl apply -f deployment.yaml

# check deployment, should still interact via Postman
kubetcl get pod

kubectl delete -f deployment.yaml -f service.yaml -f environment.yaml -f host-pv.yaml -f host-pvc.yaml
```

## Take-away: Pod-Node independence & Application State

- node claims persistent volume
- persistent volume claim references persistent volume
- temporary data are ok to store in memory, temp databases or files (removed after Pod shutdown)
- user-generated data must be stored persistent volume
