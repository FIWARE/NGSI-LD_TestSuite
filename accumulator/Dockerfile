FROM node:10-alpine

COPY . /acc
RUN cd /acc; npm install
EXPOSE ${WEB_APP_PORT:-3000}
CMD ["node", "/acc/accumulator.js"]