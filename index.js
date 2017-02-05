const Hapi = require('hapi');
const Twilio = require('./twilio');
const Docker = require('./docker');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
  host: '0.0.0.0',
  port: 4000
});

// Add the route
server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    return reply('hello local-test');
  }
});

// Health check
server.route({
  method: 'GET',
  path: '/metrics/healthcheck',
  handler: function (request, reply) {
    return reply('OK').code(200);
  }
});

server.route({
  method: 'POST',
  path: '/message/dfg983hdv9w389hdfzbz309sef8Wsdf83498df9w30a20q20202020dddfg',
  handler: function (req, res) {
    const cmd = req.payload.Body.trim();
    const from = req.payload.From;
    let responded = false;
    let response;

    setTimeout(function() {
      if(!responded) {
        return res('OK').code(200);
      }      
    }, 4000);


    switch(cmd) {
      case 'start':
        response = Docker.start(from);
        break;
      case 'kill':
        response = Docker.stop(from);
        break;
      default:
        response = Docker.exec(from, cmd);
        break;
    }

    if(!response) {
      return res('OK').code(200);
    }

    Twilio.send(from, response)
      .then(function() {
        console.log('Message sent');
        responded = true;
        return res('OK').code(200);        
      });
  }
})

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});