const nodeExec = require('child_process').execSync;
const crypto = require('crypto');

function exec(cmd, args, options) {
  args = args || [];
  options = options || {};
  return nodeExec(cmd, args, options).toString();
}

function hash(string) {
  const res = crypto.createHash('md5').update(string).digest('hex');
  return res;
}

function start(id) {
  try {
    try {
      return exec(`docker run -d -t -i --name="${hash(id)}" ubuntu`); 
    } catch(e) {
      exec(`docker start ${hash(id)}`); 
    }    
    return 'Your container has started.'
  } catch(e) {
    return 'Your container is already running.';
  }
}

function execute(id, cmd) {
 return exec(`docker exec ${hash(id)} /bin/bash -c "${cmd}"`);
}

function stop(id) {
  try {
    exec(`docker stop ${hash(id)}`);
    return 'Your container has stopped.'
  } catch(e) {
    return 'Your container has already been stopped.';
  } 
}

module.exports = {
  start: start,
  exec: execute,
  stop: stop,
}