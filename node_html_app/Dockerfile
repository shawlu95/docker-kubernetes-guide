# the name should exist on local or Docker hub
# once downloaded, it will be cached locally
FROM node

# need to change default working dir (root folter)
WORKDIR /app

# copy from source (host) . to destination (container) /app (recursive)
# Dockerfile is ignored
# COPY . /app 

# because already set WORKDIR, don't need absolute path
COPY . .

RUN npm install

# don't do this, which executes when image is built
# RUN node server.js

# expose the container's port to the host
# this line is documentation, best practice to write
# but it doesn't do anything
EXPOSE 8080

# only start server when we start CONTAINER based on the image
# always the last step
CMD ["node", "server.js"]