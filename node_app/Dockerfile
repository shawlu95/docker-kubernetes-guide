# specify a base image
FROM node:alpine

# copy everything in current build context into container
COPY ./ ./

# install dependencies
RUN npm install

# default command: npm start
CMD ["npm", "start"]