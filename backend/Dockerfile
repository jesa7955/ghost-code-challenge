FROM node:current-alpine

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node package* ./
RUN npm install
COPY --chown=node:node . .
RUN npm run build:prod

EXPOSE 3000
ARG ENV=production
ENV NODE_ENV $ENV
CMD npm run start
