## Utility Containers

Not an official term. The idea is we don't want to install some tool globally, for example `node`.

```bash
# start a node container and keep it running
docker run -it -d node

# create a project
docker exec -it $node_container_name npm init
```

The default start up command of node is to start the repl-shell. Can override the default param.

```bash
# create a new project instead of starting repl-shell
docker run -it node npm init
```

---

### Any Command

Create a node image and allow people to run any command against it. For example, create a project and copy it to host machine using bind mount. Container will shut down after project is created.

Now you don't need to install node on host machine to create a node project.

```bash
docker build -t node-util .

docker run -it --rm \
  -v /Users/shaw.lu/Documents/proj/docker-kubernetes-guide/utility-containers/app:/app \
  node-util npm init

docker run -it --rm \
  -v /Users/shaw.lu/Documents/proj/docker-kubernetes-guide/utility-containers/app:/app \
  node-util npm install
```

---

### Restrict Command

To restrict allowable command (e.g. only allow npm command), use `ENTRYPOINT`. All docker run command will be appended to the entry point command.

- docker run command will overwrite `CMD`
- docker run command will append to `ENTRYPOINT`

```bash
# ENTRYPOINT ['npm']
docker build -t node-util .

docker run -it --rm \
  -v /Users/shaw.lu/Documents/proj/docker-kubernetes-guide/utility-containers/app:/app \
  node-util init

docker run -it --rm \
  -v /Users/shaw.lu/Documents/proj/docker-kubernetes-guide/utility-containers/app:/app \
  node-util install

docker run -it --rm \
  -v /Users/shaw.lu/Documents/proj/docker-kubernetes-guide/utility-containers/app:/app \
  node-util install express --save
```
