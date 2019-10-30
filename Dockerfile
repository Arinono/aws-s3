FROM node:latest

WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN tsc

CMD [ "node ./dist/index.js" ]