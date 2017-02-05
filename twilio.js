const Twilio = require('twilio');
const Secrets = require('./secrets.json');
const twilioId = Secrets.twilioId;
const twilioToken = Secrets.twilioToken;

function send(to, message) {
  const twilioClient = new Twilio.RestClient(twilioId, twilioToken);

  return new Promise(function(res, rej) {
    const handler = function(err, message) {
      if(err) {
        console.log(err);
        return rej(err);
      }

      res(message);
    };

    twilioClient.messages.create({
      body: message,
      to: to,  // Text this number
      from: '+16698004946' // From a valid Twilio number
    }, handler);
  });
};

module.exports.send = send;
