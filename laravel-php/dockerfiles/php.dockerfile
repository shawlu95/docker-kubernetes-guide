FROM php:8.1-fpm-alpine

WORKDIR /var/www/html

COPY src .

RUN docker-php-ext-install pdo pdo_mysql

# give write access default user of php image
RUN chown -R www-data:www-data /var/www/html

# will run entry command of the base image. no need to overwride