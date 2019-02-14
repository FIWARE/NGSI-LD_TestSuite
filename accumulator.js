

const Hapi = require('hapi');

let entityData = Object.create(null);

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

const init = async () => {
    await server.start();
    console.log(`Accumulator: Server running at: ${server.info.uri}`);
};

const log = (logStr) => {
  console.log(new Date().toISOString() + ' ' + 'Accumulator: ' + logStr);
};

server.route({
    method: 'POST',
    path: '/acc',
    config: {
      response: {
        emptyStatusCode: 204
      }
    },
    handler: (request, reply) => {
      log('Accumulate request');
      
      if (request.payload.type == 'Notification') {
        log('It is a notification');
        
        if (request.payload.data && Array.isArray(request.payload.data)) {
          const data = request.payload.data;
          
          data.forEach(aEntity => {
            if (!entityData[aEntity.id]) {
              entityData[aEntity.id] = [];
            }
            entityData[aEntity.id].push(aEntity);
          });
        }
        else {
          log('Payload does not include data member or it is not an array');
        }
      }
      
      return null;
    }
});

server.route({
    method: 'POST',
    path: '/clear',
    config: {
      response: {
        emptyStatusCode: 204
      }
    },
    handler: (request, reply) => {
      log('Clear request');
      
      entityData = Object.create(null);
      
      return null;
    }
});

server.route({
  method: 'GET',
  path: '/dump',
  handler: (request, reply) => {
    log('Dump request');
    
    return entityData;
  }
});

process.on('unhandledRejection', (err) => {
    log('Error: ' + err);
    process.exit(1);
});

init();
