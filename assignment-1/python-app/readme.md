```bash
cd python-app

# create image with custom name:tag
docker build -t python_app:v0 .

# create container with custom name
docker run -p 3000:3000 -it --name python_app_container python_app:v0

# restart stopped container
docker start -i -a python_app_container

# clean up stopped container
docker rm python_app_container

# create container with custom name, remove container after stop
docker run -p 3000:3000 -it --rm --name python_app_container python_app:v0

# delete all unused images
docker image prune -a

```
