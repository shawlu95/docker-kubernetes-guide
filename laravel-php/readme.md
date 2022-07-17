# Laravel-PHP

Laravel-PHP stack is non-trivial to install on local machine. Use a multi-container setup

Three applications containers, which stay UP as long as application is running.

1. a container with php interpretor to read from local host source code (port 9000)
2. a container with nginx web server
3. a mysql container

Utility containers:

1. _Composer_: used to install dependencies. just like npm to node
2. _Laravel Artisan_: required by composer
3. _npm_: laravel uses it for some front-end logic

---

```bash
docker compose run --rm composer create-project --prefer-dist laravel/laravel .
```
