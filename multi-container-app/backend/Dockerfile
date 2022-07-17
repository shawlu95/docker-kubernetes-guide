FROM node:14

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

# default value, overwride in bash cmd -e
ENV MONGODB_USERNAME=root
ENV MONGODB_PASSWORD=secret

CMD ["npm", "run", "dev"]