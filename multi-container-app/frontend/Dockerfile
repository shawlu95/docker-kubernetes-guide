# need node to setup image although react doesn't need node
FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# by default, the port for react front-end is 3000
EXPOSE 3000

CMD [ "npm", "start" ]