FROM node:16-slim
WORKDIR /usr/server/remixionnaire

RUN apt update && apt upgrade -y && \
    apt install libssl1.1 libssl-dev ca-certificates -y

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn
COPY ./ .
# Change to pscale:generate if you are using PlanetScale
RUN yarn db:generate

ENV NODE_ENV=production
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]