ARG NODE_VERSION=10

FROM node:${NODE_VERSION}-alpine

SHELL ["/bin/ash", "-o", "pipefail", "-c"]

COPY . /acc
WORKDIR /acc
RUN npm install
EXPOSE ${WEB_APP_PORT:-3000}
CMD ["node", "/acc/accumulator.js"]