FROM node:18-slim

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
ENV NODE_PATH=src

# default to port 3000 for node, and 9229 and 9230 (tests) for debug
ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT 9229 9230

# install packages
RUN apt-get update \
  && apt-get install -q -y --no-install-recommends curl gnupg

# install the latest yarnpkg
RUN curl --compressed -o- -L https://yarnpkg.com/install.sh | bash

# install dependencies first, in a different location for easier app bind mounting for local development
# due to default /opt permissions we have to create the dir with root and change perms
RUN mkdir /opt/node_app && chown node:node /opt/node_app
WORKDIR /opt/node_app

# the official node image provides an unprivileged user as a security best practice
# but we have to manually enable it. We put it here so npm installs dependencies as the same
# user who runs the app. 
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
USER node

COPY package.json yarn.lock ./
RUN yarn --pure-lockfile && yarn cache clean --force
ENV PATH /opt/node_app/node_modules/.bin:$PATH

# check every 30s to ensure this service returns HTTP 200
# HEALTHCHECK --interval=30s CMD node /src/healthcheck.js

# copy in our source code last, as it changes the most
WORKDIR /opt/node_app/app
COPY . .

CMD [ "node", "./src/bin/www" ]
