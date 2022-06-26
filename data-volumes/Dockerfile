FROM node:14

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# declare env variable, accessed in node process.env.PORT
ENV PORT 80

EXPOSE $PORT

# let docker controls where folder lives on host machine
# VOLUME [ "/app/feedback" ]

CMD [ "npm", "start" ]