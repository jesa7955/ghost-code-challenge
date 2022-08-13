FROM node:current-alpine

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node package* ./
# examples don't use package-lock.json to minimize updates 
RUN npm install --no-package-lock
COPY --chown=node:node . .
RUN npm run build

EXPOSE 3000
ARG ENV=production
ENV NODE_ENV $ENV
CMD npm run start