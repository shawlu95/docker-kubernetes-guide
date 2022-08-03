FROM node:14

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

# default value, overwride in bash cmd -e or cloud provider
# this list is just for documentation, don't put real value here
ENV MONGODB_USERNAME=root
ENV MONGODB_PASSWORD=secret
ENV MONGO_URL=mongodb
ENV MONGODB_NAME=goals-dev

CMD ["npm", "run", "dev"]