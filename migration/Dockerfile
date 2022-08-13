FROM node:current-alpine

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node package* ./
# examples don't use package-lock.json to minimize updates 
RUN npm install --no-package-lock
COPY --chown=node:node . .

ARG ENV=production
ENV NODE_ENV $ENV
CMD npx knex migrate:up
