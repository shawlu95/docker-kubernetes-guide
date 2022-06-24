# specify a base image
FROM node:alpine

# copy everything in current build context into container
WORKDIR /usr/app
COPY ./package.json ./

# install dependencies
RUN npm install

# changing stuff other than package.json will not trigger re-install
# can also do COPY . .
COPY ./ ./

EXPOSE 8080

# default command: npm start
CMD ["npm", "start"]