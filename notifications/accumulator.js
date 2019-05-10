/*eslint no-console: "off"*/
/*eslint no-unused-vars: "off"*/

const Hapi = require('hapi');

const url = require('url');

// Notifications indexed by subscription id
let allNotifications = Object.create(null);

const endPoint = process.env.ACC_ENDPOINT || 'http://localhost:3000';
const parsedEndpoint = url.parse(endPoint);

const server = Hapi.server({
  port: parsedEndpoint.port,
  host: parsedEndpoint.hostname
});


const init = async () => {
  await server.start();
  console.log(`Accumulator: Server running at: ${server.info.uri}`);
};

const log = (logStr) => {
  console.log(`${new Date().toISOString()} Accumulator:  ${logStr}`);
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
    const payload = request.payload;
      
    if (payload.type === 'Notification' && payload.subscriptionId) {
      const subscriptionId = payload.subscriptionId;
      
      log('It is an NGSI-LD notification: ' + subscriptionId);
      
      if (!allNotifications[subscriptionId]) {
        allNotifications[subscriptionId] = {
          notifications: [],
          entityData: Object.create(null)
        }
      }
      
      allNotifications[subscriptionId].notifications.push(payload);
      
      const entityData = allNotifications[subscriptionId].entityData;
      
      if (payload.data && Array.isArray(payload.data)) {
        const data = payload.data;
          
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
      
    allNotifications = Object.create(null);
      
    return null;
  }
});

server.route({
  method: 'GET',
  path: '/dump',
  handler: (request, reply) => {
    log('Dump request');
    
    return allNotifications;
  }
});

server.route({
  method: 'POST',
  path: '/kill',
  config: {
    response: {
      emptyStatusCode: 204
    }
  },
  handler: (request, reply) => {
    log('Kill request');
    
    setTimeout(() => {
      log('Dying...');
      process.exit(0);
    }, 2000);
    
    return null;
  }
});


process.on('unhandledRejection', (err) => {
  log('Error: ' + err);
  process.exit(1);
});

init();
