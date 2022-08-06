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

- create a role for EKS [here](https://docs.aws.amazon.com/eks/latest/userguide/service_IAM_role.html#create-service-role)
- create a EKS cluster and apply the EKS role
- create a VPC named `eks-vpc` using [template](https://s3.us-west-2.amazonaws.com/amazon-eks/cloudformation/2020-10-29/amazon-eks-vpc-private-subnets.yaml)
- choose the new VPC in EKS create page
- select "public and private" as cluster endpoint access

How to issue command to EKS

- find `~/.kube/config` which contains credentials of multiple contexts
- install AWS CLI [here](https://aws.amazon.com/cli/)
- create a new access key in security credentials
  - the file contains `AWSAccessKeyId` and `AWSSecretKey`

```bash
# region keeps consistent with EKS: us-west-1
aws configure

# add k8s context, with cluster name
aws eks --region us-west-1 update-kubeconfig --name story-prod

# can now shutdown minikube and still works
minikube delete
```

Create a new node group

- create a new role `eks-node-group`, from EC2 common use case
  - select `AmazonEKSWorkerNodePolicy`
  - select `AmazonEKS_CNI_Policy`
  - select `AmazonEC2ContainerRegistryReadOnly`
- select cheap instance `tc3.small`, not the micro ones
- leave the rest as default, wait for a few minutes for it to go active

```bash
cd users-api
docker build \
  --platform=linux/amd64 \
  -t shawlu95/story-prod-users .
docker push shawlu95/story-prod-users

cd auth-api
docker build \
  --platform=linux/amd64 \
  -t shawlu95/story-prod-auth .
docker push shawlu95/story-prod-auth

cd kubernetes
kubectl apply -f auth.yaml -f users.yaml

# should see load balancer
kubectl get service
```
