FROM node:14

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# declare env variable, accessed in node process.env.PORT
ARG DEFAULT_PORT=80
ENV PORT $DEFAULT_PORT

EXPOSE $PORT

# let docker controls where folder lives on host machine
# VOLUME [ "/app/feedback" ]

# cnnot reference build arg in run time CMD
CMD [ "npm", "start" ]