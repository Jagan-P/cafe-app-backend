FROM node:16 as base

WORKDIR /workdir/server
COPY src /workdir/server/src
COPY package*.json /workdir/server
EXPOSE 3000

FROM base as dev
ENV NODE_ENV=development
RUN npm install
CMD ["npm","start"]