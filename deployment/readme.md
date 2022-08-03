## Deployment

- dev mode: encapsulate the runtime environment but not the source code, which is in bind mount
- prod mode: container is standalone, single source of truth and encapsulates all the app needs

```bash
# build the image, arg '--platform=linux/amd64' is required for m1 mac
docker build --platform=linux/amd64 -t node-depl-example .

# start app on localhost:8080
docker run -d --rm --name node-depl -p 8080:8080 node-depl-example

docker tag node-depl-example shawlu95/node-depl-example
docker image ls
docker login
docker push shawlu95/node-depl-example
```

### Getting Started with EC2

- spin up an EC2 instance
- download .pem file (add to .gitignore and .dockerignore)
- install docker on ec2
  - `amazon-linux-extras` is a nice tool provided by Amazon to make installation easy
  - if not using Amazon, follow instruction on official docker [documentation](https://docs.docker.com/engine/install)
- build image locally and push to docker hub, and pull image from EC2
  - never build image from EC2, too much trouble
- open the web at _IPv4 Public IP_
- by default, can only connect to machine via ssh (port 22). Need to configure security group for public access
  - outbound rule allows everything, so docker can pull from Docker Hub
  - inbound rule needs to allow HTTP (port 80) from everhwhere

```bash
chmod 400 docker.pem

# Connect to your instance using its Public DNS:
ssh -i "docker.pem" ec2-user@ec2-18-144-165-134.us-west-1.compute.amazonaws.com

sudo yum update -y
sudo amazon-linux-extras install docker
sudo service docker start

sudo docker pull shawlu95/node-depl-example
sudo docker run -d --rm -p 80:8080 shawlu95/node-depl-example
```

### Deploy Update

Rebuild image and push to docker hub

```bash
docker build --platform=linux/amd64 -t node-depl-example .
docker tag node-depl-example shawlu95/node-depl-example
docker push shawlu95/node-depl-example
```

On EC2 instance, stop, pull, and run the container.

```bash
sudo docker stop $container_name
sudo docker pull shawlu95/node-depl-example
sudo docker run -d --rm -p 80:8080 shawlu95/node-depl-example
```

### Disadvantage of Manual Approach

- fully own ec2 machine, responsible for config, monitoring, security, capacity/scaling, OS software, network, security/firewall
  - could easily end up with an insecure instance that can be hacked
- error-prone to ssh into the machine and issue cmd
- alternative: **ECS: elastic container service**, a managed approach so can focus on building software app, not security
  - Microsoft: Azure Kubernetes Service (AKS)
  - define container, task (which runs one or more container, like ec2 instance), service (load balance), cluster
  - access the managed container by visiting
