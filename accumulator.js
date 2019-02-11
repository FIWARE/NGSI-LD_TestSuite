'use strict';

const Hapi = require('hapi');

const entityData = Object.create(null);

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

const init = async () => {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

server.route({
    method: 'POST',
    path: '/acc',
    handler: (request, reply) => {
        if (request.payload.type == 'Notification') {
          const data = request.payload.data;
          data.forEach(aEntity => {
            entityData[aEntity.id] = aEntity;
          }); 
        }
        
        return 200;
    }
});

server.route({
  method: 'GET',
  path: '/dump',
  handler: (request, reply) => {
    return entityData;
  }
});

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
