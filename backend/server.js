const http = require('http');

const hostname = 'localhost';
let port = 5000;
let app = require('./app');
app.set('port', hostname || 5000)
const normalizePort = val =>{
port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  } if (port >= 0){
  return port;
}
return false;
};
port = normalizePort(port, hostname || 5000);
app.set('port', port)
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe' + address : 'port:' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + 'requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + 'is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
const server = http.createServer(app);
server.on('error', errorHandler);
server.on('listening', () => {
  const bind = typeof address === 'string' ? 'pipe' + address : + port;
  console.log('listening on' + bind);
});
server.listen(port);