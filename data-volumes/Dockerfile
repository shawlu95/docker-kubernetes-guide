FROM node:14

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

# let docker controls where folder lives on host machine
VOLUME [ "/app/feedback" ]

CMD [ "node", "server.js" ]