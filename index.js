const http = require('http');
const { handleRequest } = require('./routes');
const mongoDb = require('./models/db');
const resetDb = require('./setup/reset-db');

const PORT = process.env.PORT || 3000;
const server = http.createServer(handleRequest);

server.on('error', err => {
  console.error(err);
  server.close();
});

server.on('close', () => {
  console.log('Server closed.');
  mongoDb.disconnectDB();
});

server.listen(PORT, () => {
  mongoDb.connectDB();
  console.log(`Listening on port: ${PORT}`);
});


resetDb;