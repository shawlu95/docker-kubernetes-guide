Running `docker run` will return error because the script expect user input.

```bash
shaw.lu@main python-app % docker run 839964992f
Please enter the min number: Traceback (most recent call last):
  File "/app/rng.py", line 3, in <module>
    min_number = int(input('Please enter the min number: '))
EOFError: EOF when reading a line
```

Launch container in interactive mode

```bash
docker run --help
# -t --ttu create a fake terminal
# -i interactive

docker run -it 839964992f

# restart a stopped container from docker ps -a
# with interactive input in attached mode
docker start -a -i $CONTAINER_NAME/ID
```
