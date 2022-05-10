# Use an existing docker image as a base
FROM alpine

# Download and isntall a dependency
# Use previous command to create a temp container
# and execute redis installation in the temp container
# output a new, temp image
RUN apk add --update redis

# Tell image what to do when container is started
# Use image generated from previous step
# output a final image, with the primary command
# command is executed when: docker run
CMD ["redis-server"]

# how to use
# cd basic_docker_file
# docker build .
# docker run 