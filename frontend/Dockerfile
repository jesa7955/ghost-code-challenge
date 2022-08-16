FROM node:current-alpine

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

EXPOSE 3000
ARG ENV=production
ENV NODE_ENV $ENV
CMD npm run start

COPY --chown=node:node package* ./
# examples don't use package-lock.json to minimize updates 
RUN npm install --include=dev
COPY --chown=node:node . .
RUN npm run build
RUN rm -rf node_modules
RUN npm install