## Networking

This module is about connecting different services.

- three node apps, three containers
- all apps use dummy data. We don't care about data storage & persistent in this module

Architecture

- users and auths container run in the **same** pod
- users API reaches out to auth API for password check, login token
- task API lives on a **separate pod**
- auth API is not exposed any port to the public, only accessible from internal

Build and start all apps using `docker-compose up -d --build`
