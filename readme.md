* Check running container: `docker ps`
* Stop a running container: `docker stop $CONTAINERID`

Tagging the image:
```
docker build -t shaw/exercise:v0
```

Run alpine and start a shell
```
docker run -it alpine sh
```

Create a new image from a docker container manually using docker commit
1. take a container
2. do something
3. generate a new image
4. not so often used in real work
```
docker commit -c 'CMD ["redis-server"]' CONTAINERID
```