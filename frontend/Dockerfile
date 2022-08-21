FROM node:current-alpine

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

EXPOSE 3000
ARG ENV=production
ENV NODE_ENV $ENV
CMD npm run start

COPY --chown=node:node package* ./
COPY --chown=node:node . .
RUN npm install --dev && npm run build
RUN rm -rf node_modules && npm install
